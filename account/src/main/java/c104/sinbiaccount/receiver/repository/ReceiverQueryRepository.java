package c104.sinbiaccount.receiver.repository;

import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReceiverQueryRepository {
    private final RedisTemplate<String, Object> redisTemplate;

    private String getReceiverListKey(String userPhone){
        return "receiver_list_" + userPhone;
    }

    // Receiver 계좌 목록 저장
    public void saveReceiverList(String userPhone, ReceiverAccountListView receiverAccountListView){
        redisTemplate.opsForValue().set(getReceiverListKey(userPhone), receiverAccountListView);
    }

    // Receiver 계좌 목록 조회
    public ReceiverAccountListView getReceiverList(String userPhone){
        return (ReceiverAccountListView) redisTemplate.opsForValue().get(getReceiverListKey(userPhone));
    }

    // Receiver 계좌 목록 삭제 (예 : 등록/ 삭제 시)
    public void deleteReceiverList(String userPhone){
        redisTemplate.delete(getReceiverListKey(userPhone));
    }
}
