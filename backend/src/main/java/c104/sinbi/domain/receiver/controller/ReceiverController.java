package c104.sinbi.domain.receiver.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.receiver.dto.ReceiverAccountListResponse;
import c104.sinbi.domain.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbi.domain.receiver.service.ReceiverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/receiverAccount")
public class ReceiverController {

    private final ReceiverService receiverService;

    //자주 사용할 계좌 등록
    @PostMapping("/registration")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountRegistration(@RequestBody ReceiverRegistrationRequest receiverRegistrationRequest){
        receiverService.ReceiverAccountRegistration(receiverRegistrationRequest);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌 등록이 완료 되었습니다."));
    }

    //자주 사용할 계좌 목록 보기
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountList(@RequestParam int userId){
        List<ReceiverAccountListResponse> receiverAccountListResponses = receiverService.receiverAccountList(userId);
        return ResponseEntity.ok(ApiResponse.success(receiverAccountListResponses,"자주 사용할 계좌 목록 불러오기 완료"));
    }
}
