package c104.sinbiaccount.exception;

import c104.sinbiaccount.constant.ErrorCode;

public class RefreshTokenNotFoundException extends RuntimeException {
    public RefreshTokenNotFoundException() {
    }

    public RefreshTokenNotFoundException(String message) {
        super(message);
    }

    public RefreshTokenNotFoundException(ErrorCode errorCode) {
        super(errorCode.getMessage());
    }
}
