package c104.sinbiaccount.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("유저를 찾을 수 없습니다."); // 기본 메시지 설정
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
