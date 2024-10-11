package c104.sinbi.domain.account.service;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.common.exception.AccountNotFoundException;
import c104.sinbi.common.exception.IllgalArgumentException;
import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.account.dto.AccountCreateRequest;
import c104.sinbi.domain.account.dto.GetAccountListResponse;
import c104.sinbi.domain.account.dto.SaveTransactionHistoryRequest;
import c104.sinbi.domain.account.dto.TransferAccountRequest;
import c104.sinbi.domain.account.repository.AccountRepository;
import c104.sinbi.domain.receiver.Receiver;
import c104.sinbi.domain.transactionhistory.TransactionHistory;
import c104.sinbi.domain.transactionhistory.dto.TransactionHistoryResponse;
import c104.sinbi.domain.transactionhistory.repository.TransactionHistoryRepository;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import c104.sinbi.domain.virtualaccount.repository.VirtualAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;
    private final VirtualAccountRepository virtualAccountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;

    //계좌 등록
    @Transactional
    public void create(AccountCreateRequest accountCreateRequest) {
        VirtualAccount virtualAccount = virtualAccountRepository.findByAccountNumAndBankType(
                accountCreateRequest.getAccountNum(),
                accountCreateRequest.getBankType())
                .orElseThrow(() -> new AccountNotFoundException());

        Account newCreateDto = new Account(
                virtualAccount.getAccountNum(),
                virtualAccount.getBankType(),
                virtualAccount.getAmount(),
                virtualAccount.getProductName(),
                virtualAccount.getUserName()
        );

        accountRepository.save(newCreateDto);
    }

    //계좌 목록 불러오기
    public List<GetAccountListResponse> getAccountList(Long userId) {
        List<Account> accountList = accountRepository.findByUserId(userId);

        if(accountList.isEmpty()){
            throw new AccountNotFoundException();
        }

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
        List<TransactionHistory> accountList = transactionHistoryRepository.findByAccountId(accountId);
        if(accountList.isEmpty()){
            throw new AccountNotFoundException();
        }

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
        Account fromAccount = accountRepository.findByAccountIdWithLock(transferAccountRequest.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException());

        //가상 계좌 조회
        VirtualAccount toVirtualAccount = virtualAccountRepository.findByAccountNumAndBankType(transferAccountRequest.getToAccountNum(), transferAccountRequest.getToBankType())
                .orElseThrow(() -> new AccountNotFoundException());

        //계좌 잔액 확인 및 출금 (쿼리 기반)
        int updateAmount = accountRepository.withdraw(transferAccountRequest.getAccountId(), transferAccountRequest.getTransferAmount());
        if(updateAmount == 0){
            throw new IllgalArgumentException();
        }

        virtualAccountRepository.deposit(toVirtualAccount.getId(),transferAccountRequest.getTransferAmount());

        SaveTransactionHistoryRequest saveTransactionHistoryRequest =
                new SaveTransactionHistoryRequest(
                        fromAccount,toVirtualAccount
                        ,transferAccountRequest.getTransferAmount());

        saveTransactionHistory(saveTransactionHistoryRequest);
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

    //계좌 삭제
    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException());
        accountRepository.delete(account);
    }
}