package c104.sinbiaccount.util;

import c104.sinbiaccount.account.dto.VirtualAccountDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
public class VirtualAccountResponseHandler<T> {

    // CompletableFuture를 통한 비동기 처리
    private CompletableFuture<T> completableFuture = new CompletableFuture<>();

    // CompletableFuture를 가져오는 메서드
    public CompletableFuture<T> getCompletableFuture() {
        return completableFuture;
    }

    // CompletableFuture에 데이터를 완료하는 메서드
    public void complete(T response) {
        completableFuture.complete(response);
    }

    public void reset() {
        completableFuture = new CompletableFuture<>();
    }
}