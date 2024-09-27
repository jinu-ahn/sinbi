package c104.sinbiaccount.receiver.controller;

import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import c104.sinbiaccount.receiver.service.ReceiverQueryService;
import c104.sinbiaccount.util.HeaderUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/queries/receivers")
public class ReceiverQueryController {
    private final ReceiverQueryService receiverQueryService;
    private HeaderUtil headerUtil;

    @GetMapping
    @Operation(summary = "Receiver 계좌 목록 조회", description = "사용자의 Receiver 계좌 목록을 조회하는 API입니다.")
    public ResponseEntity<ReceiverAccountListView> getReceiverList(HttpServletRequest request) {
        String userPhone = headerUtil.getUserPhone(request);
        ReceiverAccountListView receiverAccountListView = receiverQueryService.getReceiverList(userPhone);
        return ResponseEntity.ok(receiverAccountListView);
    }
}
