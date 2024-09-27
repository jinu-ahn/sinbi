package c104.sinbicommon.exception;

import c104.sinbicommon.constant.ErrorCode;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("이미 가입된 번호입니다."); // 기본 메시지 설정
    }

    public UserAlreadyExistsException(String message) {
        super(message);
    }
    public UserAlreadyExistsException(ErrorCode errorCode) {super(errorCode.getMessage());}
}
