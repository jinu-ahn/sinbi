package c104.sinbiaccount.constant;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/07
 * 설명 :
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public enum ErrorCode {
    NOT_FOUND_FILE(HttpStatus.NOT_FOUND,"파일을 찾을 수 없습니다."),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN,"해당 작업을 수행할 권한이 없습니다."),
    AUTHENTICATION_ERROR(HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
    EXPIRED_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED,"재 로그인이 필요합니다."),
    BLACK_LIST_TOKEN(HttpStatus.FORBIDDEN,"로그아웃 된 유저입니다."),
    UNKNOWN_TOKEN(HttpStatus.BAD_REQUEST, "토큰이 존재하지 않습니다."),
    WRONG_TYPE_TOKEN(HttpStatus.UNAUTHORIZED, "잘못된 타입의 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    UNSUPPORTED_TOKEN(HttpStatus.FORBIDDEN, "지원되지 않는 토큰입니다."),
    DISCREPANCY_EXCEPTION(HttpStatus.FORBIDDEN,"얼굴이 일치하지 않습니다."),
    NOT_FOUND_PHONE_NUMBER(HttpStatus.NOT_FOUND,"휴대전화 번호를 찾을 수 없습니다."),
    FACE_AUTHENTICATION_IO_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"입출력 오류로 인해 얼굴 인증에 실패했습니다."),
    JSON_PARSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"JSON 파싱에 실패하였습니다.");

    private HttpStatus status;
    private String message;
}
