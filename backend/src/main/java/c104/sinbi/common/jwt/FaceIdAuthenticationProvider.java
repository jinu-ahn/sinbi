package c104.sinbi.common.jwt;

import c104.sinbi.common.constant.ErrorCode;
import c104.sinbi.common.exception.FaceAuthenticationException;
import c104.sinbi.common.exception.UserNotFoundException;
import c104.sinbi.common.util.KakaoFaceAuthenticationUtil;
import c104.sinbi.domain.user.User;
import c104.sinbi.domain.user.UserAdapter;
import c104.sinbi.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;

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

        UserDetails userDetails = userDetailsService.loadUserByUsername(phone);
        // UserDetails에서 반환한 userAdapter를 사용하여 유저객체를 가져오기 위함 (얼굴인증 시 UserRepository를 한번만 접근하기 위함)
        UserAdapter userAdapter = (UserAdapter) userDetails;

        try {
            if (authenticationUtil.faceAuthentication(userAdapter.getUser().getUserFaceId(), faceFile)){
                // UsernamePasswordAuthenticationToken에 UserDetails를 넣어 반환
                return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
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
