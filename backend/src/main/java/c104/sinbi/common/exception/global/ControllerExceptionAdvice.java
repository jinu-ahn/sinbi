package c104.sinbi.common.exception.global;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.constant.ErrorCode;
import c104.sinbi.common.exception.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

    @ExceptionHandler(JsonFormatException.class)
    public ResponseEntity<ApiResponse<?>> handleJsonFormatException(JsonFormatException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    //계좌 등록시 계좌가 없을 경우
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleAccountNotFoundException(AccountNotFoundException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFoundException(UserNotFoundException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FaceAuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleFaceAuthenticationException(FaceAuthenticationException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getErrorCode().getMessage()), e.getErrorCode().getStatus());
    }
}
