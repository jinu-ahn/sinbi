package c104.sinbiaccount.account.service;

import c104.sinbiaccount.account.dto.AccountDetailView;
import c104.sinbiaccount.account.repository.AccountQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountQueryService {
    private final AccountQueryRepository accountQueryRepository;
    private final AccountService accountService;

    public AccountDetailView getAccountDetail(Long accountId) {
        AccountDetailView cachedAccountDetail = accountQueryRepository.getAccountDetail(accountId);
        if (cachedAccountDetail != null) {
            return cachedAccountDetail;
        }

        // 캐시에 없으면 DB에서 조회 후 캐시에 저장
        var transactionHistory = accountService.getDetailAccountFromDB(accountId);
        if (transactionHistory == null || transactionHistory.isEmpty()) {
            throw new RuntimeException("No account details found for accountId: " + accountId);
        }

        AccountDetailView accountDetailView = new AccountDetailView(accountId, transactionHistory);
        accountQueryRepository.saveAccountDetail(accountId, accountDetailView);
        return accountDetailView;
    }
}
