package c104.sinbi.domain.user.dto.webauthn;

import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class AuthenticatorResponseDTO {
    private String id;
    private String rawId;
    private AuthenticatorAttestationResponseDto response;
    private String type;
    private ExtensionsDto extensions;
}