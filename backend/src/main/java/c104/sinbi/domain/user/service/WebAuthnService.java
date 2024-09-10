package c104.sinbi.domain.user.service;

import c104.sinbi.domain.user.repository.CredentialRepositoryImpl;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.RegistrationFailedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/08
 * 설명 :
 */
@Service
@RequiredArgsConstructor
public class WebAuthnService {

    private final RelyingParty relyingParty;
    private final CredentialRepositoryImpl credentialRepositoryImpl;

    // SecureRandom for challenge generation
    private final SecureRandom random = new SecureRandom();

    // 1. Registration Request 생성
    public PublicKeyCredentialCreationOptions startRegistration(String phone) {
        // 사용자 고유 식별자 (User Handle)를 생성
        ByteArray userHandle = new ByteArray(random.generateSeed(32));

        // 사용자 정보 생성
        UserIdentity userIdentity = UserIdentity.builder()
                .name(phone)
                .displayName(phone) // 사용자에게 표시될 이름
                .id(userHandle)
                .build();

        // 등록 옵션 생성
        PublicKeyCredentialCreationOptions registrationOptions = relyingParty.startRegistration(
                StartRegistrationOptions.builder()
                        .user(userIdentity)
                        .build()
        );

        // 사용자 고유 식별자를 저장 (이미 존재하지 않는 경우에만 저장)
        Optional<ByteArray> existingUserHandle = credentialRepositoryImpl.getUserHandleForUsername(phone);
        if (existingUserHandle.isEmpty()) {
            credentialRepositoryImpl.saveUserHandle(phone, userHandle);
        }

        return registrationOptions;
    }

    // 2. Registration Response 처리
    public void finishRegistration(String username, PublicKeyCredentialCreationOptions requestOptions,
                                   PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> response) throws RegistrationFailedException {
        // 등록 완료 요청을 처리
        RegistrationResult result = relyingParty.finishRegistration(
                FinishRegistrationOptions.builder()
                        .request(requestOptions)
                        .response(response)
                        .build()
        );

        // 자격 증명 데이터를 저장
        RegisteredCredential credential = RegisteredCredential.builder()
                .credentialId(result.getKeyId().getId())  // 자격 증명 ID
                .userHandle(credentialRepositoryImpl.getUserHandleForUsername(username).orElseThrow(() ->
                        new IllegalStateException("User handle not found for username: " + username)))  // UserHandle을 따로 조회
                .publicKeyCose(result.getPublicKeyCose())  // PublicKey 정보
                .signatureCount(result.getSignatureCount())  // 서명 카운트
                .build();

        // 등록된 자격 증명을 저장
        credentialRepositoryImpl.addCredential(credential);
    }

    // 3. Authentication Request 생성
    public AssertionRequest startAuthentication(String phone) {
        // 인증 시작 시, 등록된 자격 증명 ID를 기반으로 챌린지를 생성
        return relyingParty.startAssertion(
                StartAssertionOptions.builder()
                        .username(phone)
                        .build()
        );
    }

    // 4. Authentication Response 처리
    public void finishAuthentication(AssertionRequest assertionRequest,
                                     PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> response) throws AssertionFailedException {
        // 인증 완료 요청 처리
        AssertionResult result = relyingParty.finishAssertion(
                FinishAssertionOptions.builder()
                        .request(assertionRequest)
                        .response(response)
                        .build()
        );

        if (result.isSuccess()) {
            // 인증 성공 시 처리 (예: 세션 설정, JWT 토큰 발급 등)
            System.out.println("Authentication successful for user: " + result.getUsername());
        } else {
            throw new RuntimeException("Authentication failed.");
        }
    }
}
