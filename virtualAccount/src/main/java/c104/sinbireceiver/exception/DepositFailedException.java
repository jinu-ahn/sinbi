package c104.sinbireceiver.exception;

public class DepositFailedException extends RuntimeException {
    public DepositFailedException() {
        super("입금에 실패했습니다.");
    }

    public DepositFailedException(String message) {
        super(message);
    }
}
