package c104.sinbiaccount.receiver.controller;

import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbiaccount.receiver.service.ReceiverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/receiverAccount")
@Tag(name = "자주 사용하는 계좌", description = "자주 사용하는 계좌 관련 API")
public class ReceiverController {

    private final ReceiverService receiverService;

    //자주 사용할 계좌 등록
    @PostMapping("/registration")
    @Operation(summary = "자주 사용할 계좌 등록", description = "사용자가 자주 사용할 계좌를 등록하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountRegistration(@RequestBody ReceiverRegistrationRequest receiverRegistrationRequest) {
        receiverService.ReceiverAccountRegistration(receiverRegistrationRequest);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌 등록이 완료 되었습니다."));
    }

    //자주 사용할 계좌 삭제
    @DeleteMapping("/{recvId}")
    @Operation(summary = "자주 사용할 계좌 삭제", description = "등록된 자주 사용할 계좌를 삭제하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountDelete(@PathVariable Long recvId) {
        receiverService.deleteReceiverAccount(recvId);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌가 삭제 되었습니다."));
    }
}
