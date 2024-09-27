package c104.sinbicommon.user.controller;

import c104.sinbicommon.exception.global.ApiResponse;
import c104.sinbicommon.user.dto.LoginDto;
import c104.sinbicommon.user.dto.SignUpDto;
import c104.sinbicommon.user.dto.TokenDto;
import c104.sinbicommon.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(name = "사용자 관리", description = "사용자 관련 API")
@Slf4j
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    @Operation(summary = "회원 가입", description = "사용자 회원가입 API입니다.")
    public ResponseEntity<ApiResponse<String>> signUp(@Valid @RequestPart(value="signUpDto") SignUpDto signUpDto,
                                                      @RequestPart(value= "image", required = false) MultipartFile multipartFile){
        userService.signup(signUpDto,multipartFile);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("SUCCESS"));
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "사용자 로그인 API입니다.")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestPart(value="loginDto") LoginDto loginDto,
                                                     @RequestPart(value = "image", required = false) MultipartFile multipartFile,
                                                     HttpServletResponse response) throws IOException {
        userService.login(loginDto,multipartFile,response);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("SUCCESS"));
    }

    @PostMapping("/reissue")
    @Operation(summary = "토큰 재발급", description = "토큰이 만료 되었을 때 재발급 하는 API")
    public ResponseEntity<ApiResponse<TokenDto>> reissue(@RequestBody TokenDto tokenDto) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(userService.reissue(tokenDto),"SUCCESS"));
    }
}
