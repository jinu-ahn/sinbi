package c104.sinbiaccount.exception;

public class AccountAlreadyExistsException extends RuntimeException {
    public AccountAlreadyExistsException() {
        super("해당 계좌가 이미 존재합니다.");
    }

    public AccountAlreadyExistsException(String message) {
        super(message);
    }
}
