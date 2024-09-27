package c104.sinbiaccount.filter;


import c104.sinbiaccount.constant.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.security.Key;
import java.util.Date;

/**
 * 작성자 : jingu
 * 날짜 : 2024/07/25
 * 설명 : JWT 토큰을 생성및 검증
 */
@Component
@Slf4j
public class TokenProvider {
    private final Key key;

    public TokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] key = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(key);
    }

    /**
     * AccessToken 복호화
     * ParseClaimsJws 메서드가 JWT 토큰의 검증과 파싱을 모두 수행
     * @param accessToken
     * @return Claims
     */
    public Claims parseClaims(String accessToken) {
        try{
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        }catch (JwtException e) {
            throw new JwtException(ErrorCode.EXPIRED_TOKEN.getMessage());
        }
    }

    /**
     * 주어진 토큰을 검증하여 유효성 검사
     * @param token
     * @return boolean
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            throw new JwtException(ErrorCode.WRONG_TYPE_TOKEN.getMessage());
        } catch (ExpiredJwtException e) {
            throw new JwtException(ErrorCode.EXPIRED_TOKEN.getMessage());
        } catch (UnsupportedJwtException e) {
            throw new JwtException(ErrorCode.UNSUPPORTED_TOKEN.getMessage());
        } catch (IllegalArgumentException e) {
            throw new JwtException(ErrorCode.UNKNOWN_TOKEN.getMessage());
        }
    }

}
