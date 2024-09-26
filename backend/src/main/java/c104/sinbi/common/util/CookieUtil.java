package c104.sinbi.common.util;

import c104.sinbi.common.constant.ErrorCode;
import c104.sinbi.common.exception.RefreshTokenNotFoundException;
import c104.sinbi.domain.user.dto.TokenDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtil {
    private final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    // refreshToken을 담은 쿠키 생성
    public void addRefreshTokenCookie(HttpServletResponse response, TokenDto tokenDto) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, tokenDto.refreshToken())
                .domain("sinbi.life") // 해당 도메인에서만 허용
                .path("/api") // "/api" 경로에서만 쿠키 유효
                .sameSite("Strict")
                .httpOnly(true) // HTTP요청에만 허용
                .secure(true) // HTTPS 통신만 유효
                .maxAge(tokenDto.refreshTokenExpiresIn())
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }


    // refreshToken 쿠키에서 삭제
    public void deleteRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie refreshTokenCookie = getRefreshTokenFromCookies(request);

        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }

    // refreshToken 업데이트
    public void updateRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response, TokenDto tokenDto) {
        // 기존의 refreshToken을 삭제하고 새로운 refreshToken 추가
        deleteRefreshTokenCookie(request, response);
        Cookie refreshTokenCookie = getRefreshTokenFromCookies(request);
        response.addCookie(refreshTokenCookie);
    }

    // refreshToken 가져오기
    private Cookie getRefreshTokenFromCookies(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .findFirst()
                .orElseThrow(() -> new RefreshTokenNotFoundException(ErrorCode.UNKNOWN_TOKEN));
    }

}
