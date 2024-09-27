package c104.sinbireceiver.exception;

public class ReceiverSaveFailedException extends RuntimeException {
    public ReceiverSaveFailedException() {
        super("자주 사용하는 계좌 등록에 실패했습니다.");
    }

    public ReceiverSaveFailedException(String message) {
        super(message);
    }
}
