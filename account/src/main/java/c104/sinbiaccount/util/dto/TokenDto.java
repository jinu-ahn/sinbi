package c104.sinbiaccount.util.dto;

import lombok.Builder;

@Builder
public record TokenDto(String grantType,
                       String accessToken,
                       String refreshToken,
                       Long refreshTokenExpiresIn) {
}
