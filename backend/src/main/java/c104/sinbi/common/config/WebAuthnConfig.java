package c104.sinbi.common.config;

import c104.sinbi.domain.user.repository.CredentialRepositoryImpl;
import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class WebAuthnConfig {
    private final CredentialRepositoryImpl credentialRepository;
    @Bean
    public RelyingParty relyingParty(CredentialRepositoryImpl credentialRepositoryImpl) {
        RelyingPartyIdentity rpIdentity = RelyingPartyIdentity.builder()
                .id("sinbi.life")
                .name("sinbi")
                .build();

        return RelyingParty.builder()
                .identity(rpIdentity)
                .credentialRepository(credentialRepositoryImpl)
                .build();
    }
}
