package c104.sinbiaccount.account.controller;

import c104.sinbiaccount.account.dto.AccountCreateRequest;
import c104.sinbiaccount.account.dto.GetAccountListResponse;
import c104.sinbiaccount.account.dto.TransferAccountRequest;
import c104.sinbiaccount.account.service.AccountService;
import c104.sinbiaccount.exception.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
@Tag(name = "사용자 계좌", description = "사용자 계좌 관련 API")
public class AccountController {

    private final AccountService accountService;

    //계좌 등록
    @PostMapping("/create")
    @Operation(summary = "계좌 등록", description = "사용자의 계좌를 등록")
    public ResponseEntity<ApiResponse<?>> createAccount(@RequestBody AccountCreateRequest accountCreateRequest) {
        accountService.create(accountCreateRequest);
        return ResponseEntity.ok(ApiResponse.success("계좌가 성공적으로 등록되었습니다."));
    }

    //계좌 목록 조회
    @GetMapping
    @Operation(summary = "계좌 목록 조회", description = "사용자의 계좌 목록을 조회하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> getAccounts(HttpServletRequest request) {
        List<GetAccountListResponse> getAccountList = accountService.getAccountList(request);
        return ResponseEntity.ok(ApiResponse.success(getAccountList, "계좌 목록 불러오기에 성공하였습니다."));
    }

    //계좌 이체
    @PostMapping("/transfer")
    @Operation(summary = "계좌 이체", description = "특정 계좌에 이체하는 API 입니다.")
    public ResponseEntity<ApiResponse<?>> transferAccount(@RequestBody TransferAccountRequest transferAccountRequest) {
        accountService.transferAccount(transferAccountRequest);
        return ResponseEntity.ok(ApiResponse.success("이체가 성공적으로 처리됬습니다."));
    }

    //계좌 삭제
    @DeleteMapping("/{accountId}")
    @Operation(summary = "계좌 삭제", description = "특정 계좌를 삭제하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> deleteAccount(@PathVariable Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok(ApiResponse.success("계좌 삭제에 성공 했습니다."));
    }
}
