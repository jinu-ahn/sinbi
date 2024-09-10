package c104.sinbi.domain.user.dto;

import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ClientRegistrationExtensionOutputs;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WebAuthnRegistrationRequest {
    private String phone;
    private PublicKeyCredentialCreationOptions requestOptions;
    private PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> response;
}