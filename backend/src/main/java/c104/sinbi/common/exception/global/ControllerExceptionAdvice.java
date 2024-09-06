package c104.sinbi.common.exception.global;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.exception.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ControllerExceptionAdvice {

    // UserAlreadyExistsException 처리
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<?>> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        // 상태 메시지를 "이미 가입된 번호입니다."로 설정하고 반환
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    // 모든 일반 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
        // 상태 메시지를 예외 메시지로 설정하고 반환
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
