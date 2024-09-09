package c104.sinbi.domain.user.service;

import c104.sinbi.common.util.KakaoFaceAuthenticationUtil;
import c104.sinbi.common.config.s3.S3Uploader;
import c104.sinbi.common.constant.ErrorCode;
import c104.sinbi.common.exception.DiscrepancyException;
import c104.sinbi.common.exception.UserAlreadyExistsException;
import c104.sinbi.common.jwt.TokenProvider;
import c104.sinbi.common.util.RedisUtil;
import c104.sinbi.domain.user.User;
import c104.sinbi.domain.user.dto.LoginDto;
import c104.sinbi.domain.user.dto.SignUpDto;
import c104.sinbi.domain.user.dto.TokenDto;
import c104.sinbi.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;
    private final S3Uploader s3Uploader;
    private final AuthenticationManagerBuilder managerBuilder;
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;
    private final KakaoFaceAuthenticationUtil authenticationUtil;

    @Transactional
    public void signup(@Valid final SignUpDto signUpDto, final MultipartFile multiPartFile) {
        String encodedPassword = passwordEncoder.encode(signUpDto.getUserPassword()); // 패스워드 인코딩
        String convertImageUrl = null;
        if(!multiPartFile.isEmpty())
            convertImageUrl = s3Uploader.putS3(multiPartFile); // 얼굴인증 이미지 S3 저장
        User user = User.builder().signUpDto(signUpDto).encodedPassword(encodedPassword).convertImageUrl(convertImageUrl).build();

        userRepository.save(user);
    }

    /**
     * @ 작성자   : 안진우
     * @ 작성일   : 2024-09-08
     * @ 설명     : 로그인 시 토큰 발급 및 헤더에 Access, Refresh 토큰 추가
     * @param requestDto 로그인할 이메일과 비밀번호
     * @param response 토큰을 헤더에 추가하기 위한 servlet 데이터
     * @return 데이터베이스에 저장된 유저 데이터
     * @status 성공 : 200, 실패 : 401, 404
     */
    @Transactional
    public void login(@Valid final LoginDto requestDto, final MultipartFile multipartFile, HttpServletResponse response) throws IOException {
        User user = userRepository.findByUserPhone(requestDto.getPhone()).orElseThrow(
                () -> new UserAlreadyExistsException(ErrorCode.NOT_FOUND_PHONE_NUMBER)
        );
        UsernamePasswordAuthenticationToken authenticationToken;
        if(!multipartFile.isEmpty()) {
            if(authenticationUtil.faceAuthentication(user.getUserFaceId(),multipartFile))
                authenticationToken = new UsernamePasswordAuthenticationToken(requestDto.getPhone(), user.getUserFaceId());
            else {
                throw new DiscrepancyException(ErrorCode.DISCREPANCY_EXCEPTION);
            }
        }else {
            authenticationToken = new UsernamePasswordAuthenticationToken(requestDto.getPhone(), requestDto.getPassword());
        }
        Authentication authentication = managerBuilder.getObject().authenticate(authenticationToken);
        TokenDto tokenDto = tokenProvider.generateToken(authentication);
        tokenToHeader(tokenDto, response);

        redisUtil.setData(requestDto.getPhone(), tokenDto.refreshToken(), tokenDto.refreshTokenExpiresIn());
    }

    /**
     * @ 작성자   : 안진우
     * @ 작성일   : 2024-09-08
     * @ 설명     : 헤더에  Access,Refresh토큰 추가
     * @param tokenDto 로그인 시 발급한 토큰 데이터
     * @param response 토큰을 헤더에 추가하기 위한 servlet
     * @return
     */
    private void tokenToHeader(TokenDto tokenDto, HttpServletResponse response){
        response.addHeader("Authorization",tokenDto.accessToken());
        response.addHeader("refreshToken",tokenDto.refreshToken());
    }
}
