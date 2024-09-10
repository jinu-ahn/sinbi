package c104.sinbi.domain.account.service;

import c104.sinbi.common.exception.AccountNotFoundException;
import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.account.dto.AccountCreateRequest;
import c104.sinbi.domain.account.repository.AccountRepository;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import c104.sinbi.domain.virtualaccount.repository.VirtualAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;
    private final VirtualAccountRepository virtualAccountRepository;

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
}
