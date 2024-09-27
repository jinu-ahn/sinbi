package c104.sinbicommon.exception;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException() {
        super("해당 계좌를 찾을 수 없습니다.");
    }

    public AccountNotFoundException(String message) {
        super(message);
    }
}
