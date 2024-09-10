package c104.sinbi.domain.account.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.account.dto.AccountCreateRequest;
import c104.sinbi.domain.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createAccount(@RequestBody AccountCreateRequest accountCreateRequest) {
        accountService.create(accountCreateRequest);
        return ResponseEntity.ok(ApiResponse.success("계좌가 성공적으로 등록되었습니다."));
    }
}
