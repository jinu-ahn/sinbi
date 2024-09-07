package c104.sinbi.domain.user.service;

import c104.sinbi.common.config.s3.S3Uploader;
import c104.sinbi.common.exception.UserAlreadyExistsException;
import c104.sinbi.domain.user.User;
import c104.sinbi.domain.user.dto.SignUpDto;
import c104.sinbi.domain.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    // TODO : Security 에서 Bean 등록 후 new BCryptPasswordEncoder 삭제 예정
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final S3Uploader s3Uploader;
    @Transactional
    public void signup(@Valid final SignUpDto signUpDto, final MultipartFile multiPartFile) {
        String encodedPassword = passwordEncoder.encode(signUpDto.getUserPassword()); // 패스워드 인코딩
        String convertImageUrl = null;
        if(!multiPartFile.isEmpty())
            convertImageUrl = s3Uploader.putS3(multiPartFile); // 얼굴인증 이미지 S3 저장
        User user = User.builder().signUpDto(signUpDto).encodedPassword(encodedPassword).convertImageUrl(convertImageUrl).build();

        userRepository.save(user);
    }
}
