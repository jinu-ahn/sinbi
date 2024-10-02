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

    public CompletableFuture<T> createCompletableFuture(String requestId) {
        CompletableFuture<T> completableFuture = new CompletableFuture<>();
        responseMap.put(requestId, completableFuture);
        return completableFuture;
    }

    public CompletableFuture<T> getCompletableFuture(String requestId) {
        return responseMap.get(requestId);
    }

    public void complete(String requestId, T response) {
        CompletableFuture<T> completableFuture = responseMap.get(requestId);
        log.info("completableFuture : {}",completableFuture);
        if (completableFuture != null) {
            completableFuture.complete(response);
        } else {
            log.warn("Attempted to complete, but no CompletableFuture found for requestId: {}", requestId);
        }
    }

    public void cleanupCompleted() {
        responseMap.entrySet().removeIf(entry -> entry.getValue().isDone());
    }
}
