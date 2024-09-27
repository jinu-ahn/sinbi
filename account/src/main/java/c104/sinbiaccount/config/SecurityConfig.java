package c104.sinbiaccount.config;

import c104.sinbiaccount.filter.*;
import c104.sinbiaccount.util.CookieUtil;
import c104.sinbiaccount.util.KafkaProducerUtil;
import c104.sinbiaccount.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/08
 * 설명 : Security 설정
 */
@EnableWebSecurity
@RequiredArgsConstructor
@Configuration
@Slf4j
public class SecurityConfig {
    private final TokenProvider tokenProvider;
    private final CookieUtil cookieUtil;
    private final KafkaProducerUtil kafkaProducerUtil;

    private final String[] PERMIT_ALL_ARRAY = { // 허용할 API
            "/user/signup", "/user/login","/**"
    };

    private final String[] CORS_API_METHOD = { // 허용할 Method
            "GET", "POST", "PUT","PATCH", "DELETE"
    };

    private final String[] CORS_ALLOW_URL = { // 허용할 URL
            "http://localhost:3000"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // CSRF 보호 비활성화
                .csrf(AbstractHttpConfigurer::disable)
                // HTTP Basic 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)
                // 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                // CORS 설정 적용 (corsConfigurationSource 메서드에서 정의된 설정 사용)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션 관리 정책을 STATELESS로 설정 (서버에서 세션을 유지하지 않음)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 요청 권한 설정
                .authorizeHttpRequests(request -> request
                        // PERMIT_ALL_ARRAY에 정의된 모든 경로는 인증 없이 접근 허용
                        .requestMatchers(Arrays.stream(PERMIT_ALL_ARRAY)
                                .map(AntPathRequestMatcher::antMatcher)
                                .toArray(AntPathRequestMatcher[] :: new))
                        .permitAll()
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                // UsernamePasswordAuthenticationFilter 전에 AuthenticationFilter 추가
                .addFilterBefore(new AuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class)
                // AuthenticationFilter 전에 JwtExceptionFilter 추가
                .addFilterBefore(new JwtExceptionFilter(tokenProvider,cookieUtil,kafkaProducerUtil), AuthenticationFilter.class)
                // 예외 처리 설정
                .exceptionHandling(e -> {
                    // 인증 실패 시 CustomAuthenticationEntryPoint 사용
                    e.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
                    // 접근 거부 시 CustomAccessDeniedHandler 사용
                    e.accessDeniedHandler(new CustomAccessDeniedHandler());
                })
                // SecurityFilterChain 객체 빌드 및 반환
                .build();
    }


    /**
     * Swagger 사용
     * @return WebSecurityCustomizer
     */
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers("/swagger-ui/**");
    }

    /**
     * cors 설정
     * @return
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(CORS_ALLOW_URL).toList());
        configuration.setAllowedMethods(Arrays.stream(CORS_API_METHOD).toList());
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}