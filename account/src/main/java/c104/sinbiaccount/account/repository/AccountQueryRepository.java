package c104.sinbiaccount.account.repository;

import c104.sinbiaccount.account.dto.AccountDetailView;
import c104.sinbiaccount.account.dto.AccountListView;
import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AccountQueryRepository {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private String getAccountDetailKey(Long accountId) {
        return "account_detail_" + accountId;
    }

    //계좌 상세 정보 저장
    public void saveAccountDetail(Long accountId, AccountDetailView accountDetailView) {
        redisTemplate.opsForValue().set(getAccountDetailKey(accountId), accountDetailView);
    }

    //계좌 상세 정보 조회
    public AccountDetailView getAccountDetail(Long accountId) {
        return objectMapper.convertValue(redisTemplate.opsForValue().get(getAccountDetailKey(accountId)), AccountDetailView.class);
    }

    //계좌 상세 정보 삭제 (예: 거래 내역 변경 시)
    public void deleteAccountDetail(Long accountId) {
        redisTemplate.delete(getAccountDetailKey(accountId));
    }
}
