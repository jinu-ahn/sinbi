package c104.sinbiaccount.exception.global;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private String status;  // 메시지로 사용
    private T data;         // 데이터나 메시지
    private String requestId; // 새로운 요청 ID 추가

    // 성공 응답 (데이터와 메시지를 함께 반환)
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(message) // 메시지를 status로 설정
                .data(data)
                .build();
    }

    // 성공 응답 (메시지만 반환)
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .status(message) // 메시지를 status로 설정
                .build();
    }

    // requestId 설정 메서드 추가
    public ApiResponse<T> withRequestId(String requestId) {
        this.requestId = requestId;
        return this;
    }

    // 에러 응답 (에러 메시지를 반환)
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status(message)   // 메시지를 status로 설정
                .build();
    }

    /**
     * Json 형태로 반환
     *
     * @return
     */
    public String toJson() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }
}
