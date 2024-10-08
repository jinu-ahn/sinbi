package c104.sinbisecurity.util.dto;

import lombok.Builder;

@Builder
public record TokenDto(String grantType,
                       String accessToken,
                       String refreshToken,
                       Long refreshTokenExpiresIn) {
}
