package c104.sinbiaccount.filter;

import c104.sinbiaccount.constant.ErrorCode;
import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.util.CookieUtil;
import c104.sinbiaccount.util.KafkaProducerUtil;
import c104.sinbiaccount.util.dto.TokenDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final CookieUtil cookieUtil;
    private final KafkaProducerUtil kafkaProducerUtil;

    /**
     * @param request     헤더에서 토큰을 가져오기위한 servlet
     * @param response    토큰을 헤더에 추가하기 위한 servlet
     * @param filterChain filter
     * @return
     * @ 작성자   : 안진우
     * @ 작성일   : 2024-09-08
     * @ 설명     : JWT 에러 핸들링
     * @status 실패 : 400, 401, 403
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        try {
            doFilter(request, response, filterChain);
        } catch (JwtException e) {
            ErrorCode errorCode = null;

            if (e.getMessage().equals(ErrorCode.EXPIRED_TOKEN.getMessage())) {
                String accessToken = tokenProvider.resolveToken(request);
                String refreshToken = cookieUtil.getRefreshTokenFromCookies(request).getValue();
                TokenDto tokenDto = TokenDto.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                if (refreshToken != null) {
                    try {
                        // User 서비스의 토큰 재발급 엔드포인트로 동기식 HTTP 요청
                        RestTemplate restTemplate = new RestTemplate();

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        HttpEntity<TokenDto> requestEntity = new HttpEntity<>(tokenDto, headers);

                        // ParameterizedTypeReference를 사용하여 제네릭 타입 정보 유지
                        ParameterizedTypeReference<ApiResponse<TokenDto>> responseType =
                                new ParameterizedTypeReference<ApiResponse<TokenDto>>() {
                                };

                        ResponseEntity<ApiResponse<TokenDto>> responseEntity = restTemplate.exchange(
                                "https://sinbi.life/api/user/reissue", // User 서비스의 URL
                                HttpMethod.POST,
                                requestEntity,
                                responseType
                        );

                        if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null) {
                            TokenDto reissueToken = TokenDto.builder()
                                    .grantType(responseEntity.getBody().getData().grantType())
                                    .refreshToken(responseEntity.getBody().getData().refreshToken())
                                    .accessToken(responseEntity.getBody().getData().accessToken())
                                    .refreshTokenExpiresIn(responseEntity.getBody().getData().refreshTokenExpiresIn())
                                    .build();
                            // 쿠키 및 헤더 업데이트
                            cookieUtil.updateRefreshTokenCookie(request, response, reissueToken);
                            response.addHeader("Authorization", reissueToken.accessToken());
                        }
                    } catch (HttpClientErrorException | HttpServerErrorException ex) {

                        // 오류 응답 파싱
                        try {
                            ObjectMapper objectMapper = new ObjectMapper();
                            ApiResponse<String> errorResponse = objectMapper.readValue(
                                    ex.getResponseBodyAsString(),
                                    new TypeReference<ApiResponse<String>>() {
                                    }
                            );
                            String errorMessage = errorResponse.getStatus();
                            // 에러 메시지에 따라 ErrorCode 설정
                            if (errorMessage.equals(ErrorCode.EXPIRED_REFRESH_TOKEN.getMessage())) {
                                errorCode = ErrorCode.EXPIRED_REFRESH_TOKEN;
                            } else {
                                errorCode = ErrorCode.WRONG_TYPE_TOKEN;
                            }
                        } catch (Exception parseEx) {
                            errorCode = ErrorCode.JSON_PARSING_ERROR;
                        }
                    }
                }
            } else if (e.getMessage().equals(ErrorCode.UNKNOWN_TOKEN.getMessage())) {
                errorCode = ErrorCode.UNKNOWN_TOKEN;
            } else if (e.getMessage().equals(ErrorCode.WRONG_TYPE_TOKEN.getMessage())) {
                errorCode = ErrorCode.WRONG_TYPE_TOKEN;
            } else if (e.getMessage().equals(ErrorCode.UNSUPPORTED_TOKEN.getMessage())) {
                errorCode = ErrorCode.UNSUPPORTED_TOKEN;
            }

            ApiResponse<String> apiResponse;
            if (errorCode != null) {
                response.setStatus(errorCode.getStatus().value());
                apiResponse = ApiResponse.error(errorCode.getMessage());
            } else {
                apiResponse = ApiResponse.success("토큰 재발급 성공");
            }
            response.getWriter().write(apiResponse.toJson()); // ApiResponse의 toJson() 메서드를 사용하여 JSON으로 변환
        }
    }
}
