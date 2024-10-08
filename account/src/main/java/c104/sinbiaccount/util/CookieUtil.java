package c104.sinbiaccount.util;

import c104.sinbiaccount.constant.ErrorCode;
import c104.sinbiaccount.exception.RefreshTokenNotFoundException;
import c104.sinbiaccount.util.dto.TokenDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtil {
    private final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";


    // refreshToken 쿠키에서 삭제
    public void deleteRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie refreshTokenCookie = getRefreshTokenFromCookies(request);

        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }

    // refreshToken 업데이트
    public void updateRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response, TokenDto tokenDto) {
        Cookie refreshTokenCookie = getRefreshTokenFromCookies(request);
        refreshTokenCookie.setMaxAge(Math.toIntExact(tokenDto.refreshTokenExpiresIn()));
        refreshTokenCookie.setDomain("localhost");
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        response.addCookie(refreshTokenCookie);
    }

    // refreshToken 가져오기
    public Cookie getRefreshTokenFromCookies(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .findFirst()
                .orElseThrow(() -> new RefreshTokenNotFoundException(ErrorCode.UNKNOWN_TOKEN));
    }
}
