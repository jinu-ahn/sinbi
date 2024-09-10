package c104.sinbi.domain.account.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.account.dto.AccountCreateRequest;
import c104.sinbi.domain.account.dto.GetAccountListResponse;
import c104.sinbi.domain.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
public class AccountController {

    private final AccountService accountService;

    //계좌 등록
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createAccount(@RequestBody AccountCreateRequest accountCreateRequest) {
        accountService.create(accountCreateRequest);
        return ResponseEntity.ok(ApiResponse.success("계좌가 성공적으로 등록되었습니다."));
    }

    //계좌 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAccounts(@RequestParam Long userId) {
        List<GetAccountListResponse> getAccountList= accountService.getAccountList(userId);
        return ResponseEntity.ok(ApiResponse.success(getAccountList,"계좌 목록 불러오기에 성공하였습니다."));
    }
}
