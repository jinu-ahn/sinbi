package c104.sinbi.domain.receiver.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbi.domain.receiver.service.ReceiverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/receiverAccount")
public class ReceiverController {

    private final ReceiverService receiverService;

    //자주 사용할 계좌 등록
    @PostMapping("/registration")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountRegistration(@RequestBody ReceiverRegistrationRequest receiverRegistrationRequest){
        receiverService.ReceiverAccountRegistration(receiverRegistrationRequest);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌 등록이 완료 되었습니다."));
    }
}
