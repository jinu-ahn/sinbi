package c104.sinbi.common.api.kakao.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.api.kakao.service.KakaoFaceAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoFaceAuthenticationController {
    private final KakaoFaceAuthenticationService kakaoFaceAuthenticationService;


    @PostMapping("/face/authentication")
    public ResponseEntity<ApiResponse<Boolean>> faceAuthentication(@RequestPart(value= "image") MultipartFile multipartFile) throws IOException {
        boolean isAuthentication = kakaoFaceAuthenticationService.faceAuthentication(multipartFile);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(isAuthentication,isAuthentication? "얼굴 인식 성공": "얼굴 인식 실패"));
    }
}
