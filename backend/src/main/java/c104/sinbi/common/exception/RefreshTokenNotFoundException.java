package c104.sinbi.common.exception;

import c104.sinbi.common.constant.ErrorCode;

public class RefreshTokenNotFoundException extends RuntimeException {
    public RefreshTokenNotFoundException() {}

    public RefreshTokenNotFoundException(String message) {
        super(message);
    }
    public RefreshTokenNotFoundException(ErrorCode errorCode) {super(errorCode.getMessage());}
}
