package c104.sinbiaccount.receiver.repository;

import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReceiverQueryRepository {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private String getReceiverListKey(String userPhone) {
        return "receiver_list_" + userPhone;
    }

    // Receiver 계좌 목록 저장
    public void saveReceiverList(String userPhone, ReceiverAccountListView receiverAccountListView) {
        redisTemplate.opsForValue().set(getReceiverListKey(userPhone), receiverAccountListView);
    }

    // Receiver 계좌 목록 조회
    public ReceiverAccountListView getReceiverList(String userPhone) {
        return objectMapper.convertValue(redisTemplate.opsForValue().get(getReceiverListKey(userPhone)), ReceiverAccountListView.class);
    }

    // Receiver 계좌 목록 삭제 (예 : 등록/ 삭제 시)
    public void deleteReceiverList(String userPhone) {
        redisTemplate.delete(getReceiverListKey(userPhone));
    }
}
