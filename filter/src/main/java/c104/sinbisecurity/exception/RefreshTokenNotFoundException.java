package c104.sinbisecurity.exception;


import c104.sinbisecurity.constant.ErrorCode;

public class RefreshTokenNotFoundException extends RuntimeException {
    public RefreshTokenNotFoundException() {}

    public RefreshTokenNotFoundException(String message) {
        super(message);
    }
    public RefreshTokenNotFoundException(ErrorCode errorCode) {super(errorCode.getMessage());}
}
