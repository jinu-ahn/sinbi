package c104.sinbiaccount.util;

import c104.sinbiaccount.filter.TokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class HeaderUtil {
    private final TokenProvider tokenProvider;

    private String getAuthorization(HttpServletRequest request) {
        return request.getHeader("Authorization").substring(7);
    }

    public String getUserPhone(HttpServletRequest request) {
        String token = getAuthorization(request);
        return tokenProvider.parseClaims(token).getSubject();
    }
}
