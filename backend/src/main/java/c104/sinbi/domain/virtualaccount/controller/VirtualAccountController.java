package c104.sinbi.domain.virtualaccount.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import c104.sinbi.domain.virtualaccount.dto.VirtualAccountCheckRequest;
import c104.sinbi.domain.virtualaccount.service.VirtualAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/virtualAccount")
@Tag(name = "가상 계좌 관리", description = "가상계좌 관련 API")
public class VirtualAccountController {

    private final VirtualAccountService virtualAccountService;

    //상대방 계좌 조회
    @GetMapping("/check")
    @Operation(summary = "상대방 계좌 조회", description = "가상계좌가 존재하는지 확인하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> VirtualAccountCheck(
            @RequestParam String accountNum,
            @RequestParam BankTypeEnum bankTypeEnum) {
        VirtualAccountCheckRequest virtualAccountCheckRequest = new VirtualAccountCheckRequest(accountNum, bankTypeEnum);
        VirtualAccount virtualAccount = virtualAccountService.VirtualAccountCheck(virtualAccountCheckRequest);

        return ResponseEntity.ok(ApiResponse.success(virtualAccount, "계좌가 존재합니다."));
    }
}