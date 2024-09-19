package c104.sinbi.domain.user.controller;

import c104.sinbi.domain.user.dto.webauthn.WebAuthnAuthenticationRequest;
import c104.sinbi.domain.user.dto.webauthn.WebAuthnRegistrationRequest;
import c104.sinbi.domain.user.service.WebAuthnService;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.AssertionRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/webauthn")
@RequiredArgsConstructor
@Slf4j
public class WebAuthnController {

    private final WebAuthnService webAuthnService;

    // 1. WebAuthn 등록 요청 엔드포인트
    @PostMapping("/register/start")
    public ResponseEntity<PublicKeyCredentialCreationOptions> startRegistration(@RequestBody String phone) {
        // WebAuthn 등록을 시작하고 클라이언트에게 등록 옵션을 반환
        PublicKeyCredentialCreationOptions options = webAuthnService.startRegistration(phone);
        return ResponseEntity.ok(options);
    }

    // 2. WebAuthn 등록 완료 엔드포인트
    @PostMapping("/register/finish")
    public ResponseEntity<String> finishRegistration(@RequestBody WebAuthnRegistrationRequest registrationRequest) {
        try {
            log.info("registrationRequest : {}", registrationRequest.toString());
            // AuthenticatorAttestationResponse 생성
            AuthenticatorAttestationResponse attestationResponse =
                    AuthenticatorAttestationResponse.builder()
                            .attestationObject(ByteArray.fromBase64(registrationRequest.getResponse().getResponse().getAttestationObject()))
                            .clientDataJSON(ByteArray.fromBase64(registrationRequest.getResponse().getResponse().getClientDataJSON()))
                            .build();

            PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> credential =
                    PublicKeyCredential.<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs>builder()
                            .id(attestationResponse.getAttestationObject())
                            .response(attestationResponse)
                            .clientExtensionResults(ClientRegistrationExtensionOutputs.builder().build())
                            .type(PublicKeyCredentialType.PUBLIC_KEY)
                            .build();

            // 등록 완료 처리
            webAuthnService.finishRegistration(
                    registrationRequest.getPhone(),
                    registrationRequest.getRequestOptions(),
                    credential
            );
            return ResponseEntity.ok("Registration successful");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    // 3. WebAuthn 인증 요청 엔드포인트
    @PostMapping("/login/start")
    public ResponseEntity<AssertionRequest> startAuthentication(@RequestBody String phone) {
        // 인증 요청 시작
        AssertionRequest request = webAuthnService.startAuthentication(phone);
        return ResponseEntity.ok(request);
    }

    // 4. WebAuthn 인증 완료 엔드포인트
    @PostMapping("/login/finish")
    public ResponseEntity<String> finishAuthentication(@RequestBody WebAuthnAuthenticationRequest authenticationRequest) {
        try {
            // 인증 완료 처리
            webAuthnService.finishAuthentication(
                    authenticationRequest.getAssertionRequest(),
                    authenticationRequest.getResponse()
            );
            return ResponseEntity.ok("Authentication successful");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed: " + e.getMessage());
        }
    }
}
