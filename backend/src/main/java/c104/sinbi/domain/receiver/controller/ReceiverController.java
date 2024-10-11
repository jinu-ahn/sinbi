package c104.sinbi.domain.receiver.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.receiver.dto.ReceiverAccountListResponse;
import c104.sinbi.domain.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbi.domain.receiver.service.ReceiverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/receiverAccount")
@Tag(name = "자주 사용하는 계좌", description = "자주 사용하는 계좌 관련 API")
public class ReceiverController {

    private final ReceiverService receiverService;

    //자주 사용할 계좌 등록
    @PostMapping("/registration")
    @Operation(summary = "자주 사용할 계좌 등록", description = "사용자가 자주 사용할 계좌를 등록하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountRegistration(@RequestBody ReceiverRegistrationRequest receiverRegistrationRequest){
        receiverService.ReceiverAccountRegistration(receiverRegistrationRequest);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌 등록이 완료 되었습니다."));
    }

    //자주 사용할 계좌 목록 보기
    @GetMapping("/list")
    @Operation(summary = "자주 사용할 계좌 목록 보기", description = "사용자가 등록한 자주 사용할 계좌 목록을 조회하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountList(@RequestParam Long userId){
        List<ReceiverAccountListResponse> receiverAccountListResponses = receiverService.receiverAccountList(userId);
        return ResponseEntity.ok(ApiResponse.success(receiverAccountListResponses,"자주 사용할 계좌 목록 불러오기 완료"));
    }

    //자주 사용할 계좌 삭제
    @DeleteMapping("/{recvId}")
    @Operation(summary = "자주 사용할 계좌 삭제", description = "등록된 자주 사용할 계좌를 삭제하는 API입니다.")
    public ResponseEntity<ApiResponse<?>> ReceiverAccountDelete(@PathVariable Long recvId){
        receiverService.deleteReceiverAccount(recvId);
        return ResponseEntity.ok(ApiResponse.success("자주 사용할 계좌가 삭제 되었습니다."));
    }
}
