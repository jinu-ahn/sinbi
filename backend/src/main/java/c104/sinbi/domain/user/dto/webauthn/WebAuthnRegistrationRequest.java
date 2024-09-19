package c104.sinbi.domain.user.dto.webauthn;

import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class WebAuthnRegistrationRequest {
    private String phone;
    private PublicKeyCredentialCreationOptions requestOptions;
    private AuthenticatorResponseDTO response;
}