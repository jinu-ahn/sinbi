package c104.sinbiaccount.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class VirtualAccountResponseHandler<T> {
    private final Map<String, CompletableFuture<T>> responseMap = new ConcurrentHashMap<>();

    // 새로운 CompletableFuture 생성 및 저장 메서드
    public CompletableFuture<T> createCompletableFuture(String requestId) {
        if (responseMap.containsKey(requestId)) {
            log.warn("CompletableFuture already exists for requestId: {}", requestId);
        }
        CompletableFuture<T> completableFuture = new CompletableFuture<>();
        responseMap.put(requestId, completableFuture);
        return completableFuture;
    }

    // 특정 요청 ID에 대한 CompletableFuture 반환
    public CompletableFuture<T> getCompletableFuture(String requestId) {
        return responseMap.get(requestId);
    }

    // 요청 ID에 해당하는 CompletableFuture에 데이터를 완료시킴
    public void complete(String requestId, T response) {
        CompletableFuture<T> completableFuture = responseMap.remove(requestId);
        if (completableFuture != null) {
            completableFuture.complete(response);
        } else {
            log.warn("Attempted to complete, but no CompletableFuture found for requestId: {}", requestId);
        }
    }

    // 특정 요청 ID의 CompletableFuture를 초기화하는 메서드 (필요 시 사용)
    public void reset(String requestId) {
        responseMap.remove(requestId);
    }
}
