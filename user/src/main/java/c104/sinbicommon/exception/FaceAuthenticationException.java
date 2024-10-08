package c104.sinbicommon.exception;

import c104.sinbicommon.constant.ErrorCode;
import lombok.Getter;

@Getter
public class FaceAuthenticationException extends RuntimeException {
    private final ErrorCode errorCode;

    public FaceAuthenticationException(ErrorCode errorCode) {
        super(errorCode.getMessage()); // 에러 코드의 메시지를 기본 메시지로 설정
        this.errorCode = errorCode;
    }
}
