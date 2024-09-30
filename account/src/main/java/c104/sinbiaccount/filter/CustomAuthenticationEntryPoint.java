package c104.sinbiaccount.filter;

import c104.sinbiaccount.constant.ErrorCode;
import c104.sinbiaccount.exception.global.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    /**
     * @param request       헤더에서 토큰을 가져오기위한 servlet
     * @param response      토큰을 헤더에 추가하기 위한 servlet
     * @param authException exception
     * @return 인증 실패 에러 코드와 설명
     * @ 작성자   : 안진우
     * @ 작성일   : 2024-09-08
     * @ 설명     : 인증 실패 시 에러 핸들링
     * @status 실패 : 401
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setContentType("application/json");
        response.setStatus(ErrorCode.AUTHENTICATION_ERROR.getStatus().value());
        ApiResponse<String> apiResponse = ApiResponse.error(ErrorCode.AUTHENTICATION_ERROR.getMessage());
        response.getWriter().write(apiResponse.toJson()); // ApiResponse의 toJson() 메서드를 사용하여 JSON으로 변환
    }
}