package c104.sinbicommon.exception;


import c104.sinbicommon.constant.ErrorCode;

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
