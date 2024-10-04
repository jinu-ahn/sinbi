package c104.sinbiaccount.util;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Component
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
        if (completableFuture != null) {
            completableFuture.complete(response);
        } else {
        }
    }

    public void cleanupCompleted() {
        responseMap.entrySet().removeIf(entry -> entry.getValue().isDone());
    }
}
