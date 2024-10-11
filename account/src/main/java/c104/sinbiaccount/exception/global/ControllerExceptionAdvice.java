package c104.sinbiaccount.exception.global;

import c104.sinbiaccount.exception.*;
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

    //계좌 등록시 계좌가 없을 경우
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleAccountNotFoundException(AccountNotFoundException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFoundException(UserNotFoundException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    // ReceiverSaveFailedException 처리
    @ExceptionHandler(ReceiverSaveFailedException.class)
    public ResponseEntity<ApiResponse<?>> handleReceiverSaveFailedException(ReceiverSaveFailedException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ReceiverAlreadyExistsException 처리 (추가된 부분)
    @ExceptionHandler(ReceiverAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<?>> handleReceiverAlreadyExistsException(ReceiverAlreadyExistsException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.CONFLICT);  // 충돌 상태로 반환
    }

    // IllgalArgumentException 처리 (추가된 부분)
    @ExceptionHandler(IllgalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(IllgalArgumentException e) {
        return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
