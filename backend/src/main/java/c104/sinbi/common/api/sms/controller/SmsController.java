package c104.sinbi.common.api.sms.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.api.sms.dto.CoolSmsRequestDto;
import c104.sinbi.common.api.sms.dto.SmsVerifyDto;
import c104.sinbi.common.api.sms.service.CoolSmsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sms")
public class SmsController {

    private final CoolSmsService smsService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendSMS(@RequestBody @Valid CoolSmsRequestDto smsRequestDto){
        smsService.SendSms(smsRequestDto);
        return ResponseEntity.ok(ApiResponse.success("문자를 전송했습니다."));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyCode(@RequestBody @Valid SmsVerifyDto smsVerifyDto){
        boolean verify = smsService.verifyCode(smsVerifyDto);
        if (verify) {
            return ResponseEntity.ok(ApiResponse.success("인증이 되었습니다."));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("인증에 실패했습니다."));
        }
    }
}
