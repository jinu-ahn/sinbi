package c104.sinbi.domain.user.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.domain.user.dto.SignUpDto;
import c104.sinbi.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signUp(@RequestPart(value="signUpDto") SignUpDto signUpDto,
                                                      @RequestPart(value= "image") MultipartFile multipartFile){
        userService.signup(signUpDto,multipartFile);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("SUCCESS"));
    }
}
