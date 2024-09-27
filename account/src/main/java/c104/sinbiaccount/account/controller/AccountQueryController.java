package c104.sinbiaccount.account.controller;

import c104.sinbiaccount.account.dto.AccountDetailView;
import c104.sinbiaccount.account.service.AccountQueryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/queries/accounts")
public class AccountQueryController {
    private final AccountQueryService accountQueryService;

    @GetMapping("/{accountId}/details")
    @Operation(summary = "계좌 상세 조회", description = "특정 계좌의 상세 내역을 조회하는 API입니다.")
    public ResponseEntity<AccountDetailView> getAccountDetail(@PathVariable Long accountId) {
        AccountDetailView accountDetailView = accountQueryService.getAccountDetail(accountId);
        return ResponseEntity.ok(accountDetailView);
    }
}
