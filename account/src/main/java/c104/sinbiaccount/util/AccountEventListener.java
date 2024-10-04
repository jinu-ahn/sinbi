package c104.sinbiaccount.util;

import c104.sinbiaccount.account.repository.AccountQueryRepository;
import c104.sinbiaccount.account.service.AccountQueryService;
import c104.sinbiaccount.exception.global.ApiResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ApiException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountEventListener {
    private final AccountQueryService accountQueryService;
    private final ObjectMapper objectMapper;
    private final AccountQueryRepository accountQueryRepository;

    // TypeReference를 상수로 재사용
    private static final TypeReference<Map<String, Object>> MAP_TYPE_REF = new TypeReference<Map<String, Object>>() {
    };

    @KafkaListener(topics = "${spring.kafka.topics.account-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void handleAccountEvent(ApiResponse<?> apiResponse) {

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
                    break;

                case "ACCOUNT_WITHDRAW_ROLLED_BACK":
                    Long rolledBackAccountId = objectMapper.convertValue(map.get("data"), Long.class);
                    // 계좌 상세 정보 캐시 무효화
                    accountQueryRepository.deleteAccountDetail(rolledBackAccountId);
                    // 추가 로직: 롤백 후의 처리
                    break;

                default:
            }
        } catch (IllegalArgumentException e) {
            throw new ApiException(e.getMessage());
        } catch (Exception e) {
            throw new ApiException(e.getMessage());
        }
    }
}
