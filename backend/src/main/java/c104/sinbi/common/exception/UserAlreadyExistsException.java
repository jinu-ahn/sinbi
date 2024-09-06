package c104.sinbi.common.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("이미 가입된 번호입니다."); // 기본 메시지 설정
    }

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
