package c104.sinbi.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {

    private String status;  // 메시지로 사용
    private T data;         // 데이터나 메시지

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

    // 에러 응답 (에러 메시지를 반환)
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status(message)   // 메시지를 status로 설정
                .build();
    }
}
