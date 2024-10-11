package c104.sinbicommon.user.dto;

import lombok.Builder;

/**
 * 작성자 : jingu
 * 날짜 : 2024/07/25
 * 설명 : Token Data Transfer Object
 */
@Builder
public record TokenDto(String grantType,
                       String accessToken,
                       String refreshToken,
                       Long refreshTokenExpiresIn) {
}
