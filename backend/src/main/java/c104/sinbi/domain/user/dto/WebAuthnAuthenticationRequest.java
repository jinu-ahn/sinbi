package c104.sinbi.domain.user.dto;

import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.AuthenticatorAssertionResponse;
import com.yubico.webauthn.data.ClientAssertionExtensionOutputs;
import com.yubico.webauthn.AssertionRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WebAuthnAuthenticationRequest {
    private AssertionRequest assertionRequest;
    private PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> response;
}