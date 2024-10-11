package c104.sinbicommon.exception;

public class JsonFormatException extends RuntimeException {
    public JsonFormatException() {
        super("얼굴인식 응답 값에 대한 JSON 데이터 처리 오류"); // 기본 메시지 설정
    }

    public JsonFormatException(String message) {
        super(message);
    }
}
