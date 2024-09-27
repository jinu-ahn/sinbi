package c104.sinbicommon.exception;

public class S3Exception extends RuntimeException {
    public S3Exception() {
        super("파일 변환 실패"); // 기본 메시지 설정
    }

    public S3Exception(String message) {
        super(message);
    }
}
