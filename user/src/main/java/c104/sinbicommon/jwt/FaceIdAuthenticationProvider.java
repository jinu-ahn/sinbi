package c104.sinbicommon.jwt;

import c104.sinbicommon.constant.ErrorCode;
import c104.sinbicommon.exception.FaceAuthenticationException;
import c104.sinbicommon.user.User;
import c104.sinbicommon.util.KakaoFaceAuthenticationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class FaceIdAuthenticationProvider implements AuthenticationProvider {
    private final UserDetailsService userDetailsService;
    private final KakaoFaceAuthenticationUtil authenticationUtil;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String phone = authentication.getPrincipal().toString();
        MultipartFile faceFile = (MultipartFile) authentication.getCredentials();

        User user = (User) userDetailsService.loadUserByUsername(phone);
        try {
            if (authenticationUtil.faceAuthentication(user.getUserFaceId(), faceFile)){
                // UsernamePasswordAuthenticationToken에 UserDetails를 넣어 반환
                return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            }
        }catch (IOException e) {
            throw new FaceAuthenticationException(ErrorCode.FACE_AUTHENTICATION_IO_ERROR);
        }

        // 얼굴 불일치
        throw new FaceAuthenticationException(ErrorCode.DISCREPANCY_EXCEPTION);

    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }
}
