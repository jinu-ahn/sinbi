package c104.sinbi.common.constant;

import lombok.*;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/07
 * 설명 :
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public enum ErrorCode {
    NOT_FOUND_FILE("파일을 찾을 수 없습니다.");

    private String message;
}
