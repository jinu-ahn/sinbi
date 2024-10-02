package c104.sinbiaccount.account.service;

import c104.sinbiaccount.account.Account;
import c104.sinbiaccount.account.dto.*;
import c104.sinbiaccount.account.repository.AccountRepository;
import c104.sinbiaccount.exception.AccountAlreadyExistsException;
import c104.sinbiaccount.exception.AccountNotFoundException;
import c104.sinbiaccount.exception.IllgalArgumentException;
import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.transactionhistory.TransactionHistory;
import c104.sinbiaccount.transactionhistory.dto.TransactionHistoryResponse;
import c104.sinbiaccount.transactionhistory.repository.TransactionHistoryRepository;
import c104.sinbiaccount.util.HeaderUtil;
import c104.sinbiaccount.util.KafkaProducerUtil;
import c104.sinbiaccount.util.RedisUtil;
import c104.sinbiaccount.util.VirtualAccountResponseHandler;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final KafkaProducerUtil kafkaProducerUtil;
    private final VirtualAccountResponseHandler virtualAccountResponseHandler;
    private final RedisUtil redisUtil;
    private final HeaderUtil headerUtil;

    // 계좌 등록
    @Transactional
    public void create(AccountCreateRequest accountCreateRequest) {
        String requestId = UUID.randomUUID().toString();
        kafkaProducerUtil.sendAccountNumAndBankType(ApiResponse.success(accountCreateRequest, "SUCCESS").withRequestId(requestId));
        try {
            CommandVirtualAccountDto virtualAccount = (CommandVirtualAccountDto) virtualAccountResponseHandler.getCompletableFuture("CREATE_ACCOUNT")
                    .get(5, TimeUnit.SECONDS);

            // 계좌 등록 시 중복 체크 로직
            Optional<Account> existingAccount = accountRepository.findByAccountNum(virtualAccount.getAccountNum());
            if (existingAccount.isPresent()) {
                throw new AccountAlreadyExistsException();
            }

            Account account = new Account(
                    virtualAccount.getAccountNum(),
                    virtualAccount.getBankType(),
                    virtualAccount.getAmount(),
                    virtualAccount.getProductName(),
                    virtualAccount.getUserName(),
                    virtualAccount.getUserPhone()
            );
            accountRepository.save(account);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("가상 계좌 조회 실패: {}", e.getMessage());
            throw new AccountNotFoundException();
        }
    }

    // 계좌 비밀번호 조회
    @Transactional
    public void authenticate(VirtualAccountAuthenticateRequest virtualAccountAuthenticateRequest) {
        String requestId = UUID.randomUUID().toString();
        // Kafka 메시지 전송
        kafkaProducerUtil.sendVirtualAccountAuthenticate(ApiResponse.success(virtualAccountAuthenticateRequest, "SUCCESS").withRequestId(requestId));
        try {
            virtualAccountResponseHandler.createCompletableFuture(requestId);
            // Kafka 리스너로부터 결과를 기다림 (timeout 5초)
            Boolean isAuthenticationSuccessful = (Boolean) virtualAccountResponseHandler.getCompletableFuture(requestId)
                    .get(5, TimeUnit.SECONDS);
            virtualAccountResponseHandler.cleanupCompleted();
            if (Boolean.TRUE.equals(isAuthenticationSuccessful)) {
                log.info("계좌 인증 성공");
            } else {
                throw new AccountNotFoundException();
            }
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("계좌 인증 실패: {}", e.getMessage());
            throw new AccountNotFoundException();
        }
    }

    // 계좌 목록 불러오기
    public List<GetAccountListResponse> getAccountList(HttpServletRequest request) {
        List<Account> accountList = accountRepository.findAllByUserPhone(headerUtil.getUserPhone(request));
        return accountList.stream()
                .map(account -> new GetAccountListResponse(
                        account.getId(),
                        account.getAccountNum(),
                        account.getBankType(),
                        account.getAmount(),
                        account.getProductName()
                )).collect(Collectors.toList());
    }

    // 계좌 이체
    @Transactional
    public void transferAccount(TransferAccountRequest transferAccountRequest) {
        // 비관적 락 적용 계좌 조회
        Account fromAccount = accountRepository.findByAccountIdWithLock(
                        transferAccountRequest.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException());

        AccountCreateRequest accountCreateRequest = new AccountCreateRequest(
                transferAccountRequest.getToAccountNum(),
                transferAccountRequest.getToBankType()
        );

        // 계좌 잔액 확인 및 출금 (쿼리 기반)
        int updateAmount = accountRepository.withdraw(transferAccountRequest.getAccountId(), transferAccountRequest.getTransferAmount());
        if (updateAmount == 0) {
            throw new IllgalArgumentException();
        }

        // 가상 계좌 조회
        kafkaProducerUtil.sendAccountNumAndBankType(ApiResponse.success(accountCreateRequest, "SUCCESS"));
        try {
            CommandVirtualAccountDto virtualAccount = (CommandVirtualAccountDto) virtualAccountResponseHandler.getCompletableFuture("TRANSFER_ACCOUNT")
                    .get(5, TimeUnit.SECONDS);

            // 가상계좌에 입금
            DepositRequestDto depositRequestDto = new DepositRequestDto(
                    virtualAccount.getId(),
                    transferAccountRequest.getTransferAmount()
            );

            kafkaProducerUtil.sendDeposit(ApiResponse.success(depositRequestDto, "SUCCESS"));
            try {
                // 거래 내역 저장
                SaveTransactionHistoryRequest saveTransactionHistoryRequest =
                        new SaveTransactionHistoryRequest(
                                fromAccount,
                                virtualAccount,
                                transferAccountRequest.getTransferAmount()
                        );

                saveTransactionHistory(saveTransactionHistoryRequest);

                // 이벤트 발행: 거래 완료 후 Redis 갱신을 위해 이벤트 전송
                AccountEvent event = new AccountEvent("ACCOUNT_TRANSFER_COMPLETED", fromAccount.getUserPhone(), transferAccountRequest.getAccountId());

                // Redis에 저장
                redisUtil.setData("TRANSFER_EVENT:" + transferAccountRequest.getAccountId(), event.toString(), 3600000L); // 1시간 TTL

                // Kafka로 이벤트 전송
                kafkaProducerUtil.sendAccountEvent(ApiResponse.success(event, "SUCCESS"));
            } catch (Exception e) {
                log.info(e.getMessage());
                // 입금 실패 시, 보상 로직 (출금 롤백)
                RollBackDto rollBackDto = new RollBackDto(
                        transferAccountRequest.getAccountId(),
                        transferAccountRequest.getTransferAmount(),
                        fromAccount
                );
                rollbackWithdraw(rollBackDto);
            }
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            throw new AccountNotFoundException();
        }
    }

    // 거래 내역 저장
    private void saveTransactionHistory(SaveTransactionHistoryRequest saveTransactionHistoryRequest) {
        TransactionHistory transactionHistory = new TransactionHistory(
                "이체",
                saveTransactionHistoryRequest.getToVirtualAccount().getAccountNum(),
                saveTransactionHistoryRequest.getToVirtualAccount().getUserName(),
                saveTransactionHistoryRequest.getTransferAmount().toString(),
                saveTransactionHistoryRequest.getFromAccount().getBankType(),
                saveTransactionHistoryRequest.getFromAccount()
        );

        // 먼저 저장
        transactionHistoryRepository.save(transactionHistory);

        // 저장 후 createdAt을 사용할 수 있음
        log.info("거래 내역 저장 완료: 생성 시각 = {}", transactionHistory.getCreatedAt());
    }

    // 출금 롤백 (보상 로직)
    @Transactional
    public void rollbackWithdraw(RollBackDto rollbackDto) {
        // 출금 롤백: 출금 금액 복구
        accountRepository.credit(rollbackDto.getAccountId(), rollbackDto.getTransferAmount());

        // 롤백 내역 저장
        TransactionHistory rollbackHistory = new TransactionHistory(
                "출금 롤백",
                rollbackDto.getFromAccount().getAccountNum(),
                rollbackDto.getFromAccount().getUserName(),
                rollbackDto.getTransferAmount().toString(),
                rollbackDto.getFromAccount().getBankType(),
                rollbackDto.getFromAccount()
        );
        transactionHistoryRepository.save(rollbackHistory);

        log.info("출금이 롤백되었습니다. 계좌 번호: {}, 금액: {}", rollbackDto.getFromAccount().getAccountNum(), rollbackDto.getTransferAmount());

        // 이벤트 발행: 출금 롤백 후 Redis 갱신을 위해 이벤트 전송
        AccountEvent event = new AccountEvent("ACCOUNT_WITHDRAW_ROLLED_BACK", rollbackDto.getFromAccount().getUserPhone(), rollbackDto.getAccountId());

        // Redis에 저장
        redisUtil.setData("WITHDRAW_ROLLBACK_EVENT:" + rollbackDto.getAccountId(), event.toString(), 3600000L); // 1시간 TTL

        // Kafka로 이벤트 전송
        kafkaProducerUtil.sendAccountEvent(ApiResponse.success(event, "SUCCESS"));
    }

    // 계좌 삭제
    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException());
        accountRepository.delete(account);
    }

    // 거래 내역 상세 조회
    public List<TransactionHistoryResponse> getDetailAccountFromDB(Long accountId) {
        accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException());

        return transactionHistoryRepository.findByAccountId(accountId)
                .stream()
                .map(history -> new TransactionHistoryResponse(
                        history.getId(),
                        history.getTransactionHistoryType(),
                        history.getRecvAccountNum(),
                        history.getRecvAccountName(),
                        history.getTransferAmount(),
                        history.getBankType(),
                        history.getCreatedAt() != null ? history.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "N/A"
                )).collect(Collectors.toList());
    }
}