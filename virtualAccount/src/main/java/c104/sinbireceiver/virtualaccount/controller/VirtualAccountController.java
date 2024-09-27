package c104.sinbireceiver.virtualaccount.controller;

import c104.sinbireceiver.constant.BankTypeEnum;
import c104.sinbireceiver.exception.global.ApiResponse;
import c104.sinbireceiver.virtualaccount.VirtualAccount;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountCheckRequest;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountDto;
import c104.sinbireceiver.virtualaccount.service.VirtualAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        VirtualAccountDto virtualAccount = virtualAccountService.VirtualAccountCheck(virtualAccountCheckRequest);

        return ResponseEntity.ok(ApiResponse.success(virtualAccount, "계좌가 존재합니다."));
    }
}