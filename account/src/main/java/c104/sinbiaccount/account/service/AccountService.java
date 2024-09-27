package c104.sinbiaccount.account.service;


import c104.sinbiaccount.account.Account;
import c104.sinbiaccount.account.dto.*;
import c104.sinbiaccount.account.repository.AccountRepository;
import c104.sinbiaccount.exception.AccountNotFoundException;
import c104.sinbiaccount.exception.IllgalArgumentException;
import c104.sinbiaccount.exception.UserNotFoundException;
import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.filter.TokenProvider;
import c104.sinbiaccount.transactionhistory.TransactionHistory;
import c104.sinbiaccount.transactionhistory.dto.TransactionHistoryResponse;
import c104.sinbiaccount.transactionhistory.repository.TransactionHistoryRepository;
import c104.sinbiaccount.util.HeaderUtil;
import c104.sinbiaccount.util.KafkaProducerUtil;
import c104.sinbiaccount.util.VirtualAccountResponseHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
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
    private final HeaderUtil headerUtil;

    //계좌 등록
    @Transactional
    public void create(AccountCreateRequest accountCreateRequest) {
        kafkaProducerUtil.sendAccountNumAndBankType(ApiResponse.success(accountCreateRequest, "SUCCESS"));
        try {
            VirtualAccountDto virtualAccount = (VirtualAccountDto) virtualAccountResponseHandler.getCompletableFuture().get();
            Account account = new Account(
                    virtualAccount.getAccountNum(),
                    virtualAccount.getBankType(),
                    virtualAccount.getAmount(),
                    virtualAccount.getProductName(),
                    virtualAccount.getUserName(),
                    virtualAccount.getUserPhone()
            );
            accountRepository.save(account);
        } catch (Exception e) {
            log.info(e.getMessage());
        }

    }

    //계좌 목록 불러오기
    public List<GetAccountListResponse> getAccountList(HttpServletRequest request) {
        List<Account> accountList = accountRepository.findByUserPhone(headerUtil.getUserPhone(request));
        return accountList.stream()
                .map(account -> new GetAccountListResponse(
                        account.getId(),
                        account.getAccountNum(),
                        account.getBankType(),
                        account.getAmount(),
                        account.getProductName()
                )).collect(Collectors.toList());
    }

    //계좌 상세 보기
    public List<TransactionHistoryResponse> getDetailAccount(Long accountId) {
        accountRepository.findById(
                accountId.describeConstable()
                        .orElseThrow(() -> new AccountNotFoundException()));

        List<TransactionHistory> accountList = transactionHistoryRepository.findByAccountId(accountId);
        return accountList.stream()
                .map(account -> new TransactionHistoryResponse(
                        account.getId(),
                        account.getTransactionHistoryType(),
                        account.getRecvAccountNum(),
                        account.getRecvAccountName(),
                        account.getTransferAmount(),
                        account.getBankType(),
                        account.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                )).collect(Collectors.toList());
    }

    //계좌 이체
    @Transactional
    public void transferAccount(TransferAccountRequest transferAccountRequest) {
        //비관적 락 적용 계좌 조회
        Account fromAccount = accountRepository.findByAccountIdWithLock(
                        transferAccountRequest.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException());

        AccountCreateRequest accountCreateRequest = new AccountCreateRequest(
                transferAccountRequest.getToAccountNum(),
                transferAccountRequest.getToBankType()
        );

        //계좌 잔액 확인 및 출금 (쿼리 기반)
        int updateAmount = accountRepository.withdraw(transferAccountRequest.getAccountId(), transferAccountRequest.getTransferAmount());
        if (updateAmount == 0) {
            throw new IllgalArgumentException();
        }

        //가상 계좌 조회
        kafkaProducerUtil.sendAccountNumAndBankType(ApiResponse.success(accountCreateRequest, "SUCCESS"));
        try {
            VirtualAccountDto virtualAccount = (VirtualAccountDto) virtualAccountResponseHandler.getCompletableFuture().get();
            VirtualAccountDto toVirtualAccount = new VirtualAccountDto(
                    virtualAccount.getId(),
                    virtualAccount.getAccountNum(),
                    virtualAccount.getBankType(),
                    virtualAccount.getAmount(),
                    virtualAccount.getProductName(),
                    virtualAccount.getUserName(),
                    virtualAccount.getUserPhone()
            );

            //가상계좌에 입금
            DepositRequestDto depositRequestDto = new DepositRequestDto(
                    toVirtualAccount.getId(),
                    transferAccountRequest.getTransferAmount()
            );

            kafkaProducerUtil.sendDeposit(ApiResponse.success(depositRequestDto, "SUCCESS"));
            try {
                //거래 내역 저장
                SaveTransactionHistoryRequest saveTransactionHistoryRequest =
                        new SaveTransactionHistoryRequest(
                                fromAccount,
                                toVirtualAccount,
                                transferAccountRequest.getTransferAmount()
                        );

                saveTransactionHistory(saveTransactionHistoryRequest);
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
        } catch (Exception e) {
            throw new AccountNotFoundException();
        }
    }

    //거래 내역 저장
    private void saveTransactionHistory(SaveTransactionHistoryRequest saveTransactionHistoryRequest) {
        TransactionHistory transactionHistory = new TransactionHistory(
                "이체",
                saveTransactionHistoryRequest.getToVirtualAccount().getAccountNum(),
                saveTransactionHistoryRequest.getToVirtualAccount().getUserName(),
                saveTransactionHistoryRequest.getTransferAmount().toString(),
                saveTransactionHistoryRequest.getFromAccount().getBankType(),
                saveTransactionHistoryRequest.getFromAccount()
        );
        transactionHistoryRepository.save(transactionHistory);
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
    }

    //계좌 삭제
    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException());
        accountRepository.delete(account);
    }
}