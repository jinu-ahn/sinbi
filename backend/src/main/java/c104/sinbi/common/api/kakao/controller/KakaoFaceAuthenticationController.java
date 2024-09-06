package c104.sinbi.common.api.kakao.controller;

import c104.sinbi.common.ApiResponse;
import c104.sinbi.common.api.kakao.service.KakaoFaceAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoFaceAuthenticationController {
    private final KakaoFaceAuthenticationService kakaoFaceAuthenticationService;


    @GetMapping("/face/authentication")
    public ResponseEntity<ApiResponse<Boolean>> test() throws IOException {
        boolean isAuthentication = kakaoFaceAuthenticationService.faceAuthentication();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(isAuthentication,isAuthentication? "얼굴 인식 성공": "얼굴 인식 실패"));
    }
}
