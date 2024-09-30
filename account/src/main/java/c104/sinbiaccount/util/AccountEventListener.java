package c104.sinbiaccount.util;

import c104.sinbiaccount.account.repository.AccountQueryRepository;
import c104.sinbiaccount.account.service.AccountQueryService;
import c104.sinbiaccount.exception.global.ApiResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountEventListener {
    private final AccountQueryService accountQueryService;
    private final ObjectMapper objectMapper;
    private final AccountQueryRepository accountQueryRepository;

    // TypeReference를 상수로 재사용
    private static final TypeReference<Map<String, Object>> MAP_TYPE_REF = new TypeReference<Map<String, Object>>() {
    };

    @KafkaListener(topics = "${spring.kafka.topics.account-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void handleAccountEvent(ApiResponse<?> apiResponse) {
        log.info("Received account event: {}", apiResponse);

        try {
            // ApiResponse의 data를 Map으로 변환
            Map<String, Object> map = objectMapper.convertValue(apiResponse.getData(), MAP_TYPE_REF);

            // eventType과 userPhone을 추출
            String eventType = (String) map.get("eventType");
            String userPhone = (String) map.get("userPhone");

            switch (eventType) {
                case "ACCOUNT_TRANSFER_COMPLETED":
                    Long transferAccountId = objectMapper.convertValue(map.get("data"), Long.class);
                    // 계좌 상세 정보 캐시 무효화
                    accountQueryRepository.deleteAccountDetail(transferAccountId);
                    // 추가 로직: 계좌 전송 완료 후의 처리
                    log.info("Account transfer completed. Account ID: {}", transferAccountId);
                    break;

                case "ACCOUNT_WITHDRAW_ROLLED_BACK":
                    Long rolledBackAccountId = objectMapper.convertValue(map.get("data"), Long.class);
                    // 계좌 상세 정보 캐시 무효화
                    accountQueryRepository.deleteAccountDetail(rolledBackAccountId);
                    // 추가 로직: 롤백 후의 처리
                    log.info("Account withdraw rolled back. Account ID: {}", rolledBackAccountId);
                    break;

                default:
                    log.warn("Unknown event type: {}", eventType);
            }
        } catch (IllegalArgumentException e) {
            log.error("Illegal argument in account event. Event data: {}", apiResponse.getData(), e);
        } catch (Exception e) {
            log.error("Error processing account event. EventType: {}, Data: {}, Error: {}", apiResponse.getData(), e.getMessage(), e);
        }
    }
}
