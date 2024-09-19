package c104.sinbi.domain.user.dto.webauthn;

import com.yubico.webauthn.data.Extensions;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExtensionsDto {
    private Extensions.CredentialProperties.CredentialPropertiesOutput credProps;
}
