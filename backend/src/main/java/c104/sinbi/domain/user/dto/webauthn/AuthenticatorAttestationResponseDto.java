package c104.sinbi.domain.user.dto.webauthn;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AuthenticatorAttestationResponseDto {
    private String attestationObject;
    private String clientDataJSON;
}
