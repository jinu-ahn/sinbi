package c104.sinbi.domain.virtualaccount.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.virtualaccount.dto.VirtualAccountCheckRequest;
import c104.sinbi.domain.virtualaccount.service.VirtualAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/virtualAccount")
public class VirtualAccountController {

    private final VirtualAccountService virtualAccountService;

    //상대방 계좌 조회
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<?>> VirtualAccountCheck(
            @RequestParam String accountNum,
            @RequestParam BankTypeEnum bankTypeEnum) {
        VirtualAccountCheckRequest virtualAccountCheckRequest = new VirtualAccountCheckRequest(accountNum, bankTypeEnum);
        virtualAccountService.VirtualAccountCheck(virtualAccountCheckRequest);

        return ResponseEntity.ok(ApiResponse.success("계좌가 존재합니다."));
    }
}
