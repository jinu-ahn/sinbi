package c104.sinbi.domain.user.repository;


import com.yubico.webauthn.CredentialRepository;
import com.yubico.webauthn.RegisteredCredential;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class CredentialRepositoryImpl implements CredentialRepository {

    // 사용자 이름에 대한 자격 증명 ID 목록 저장소
    private final Map<String, Set<PublicKeyCredentialDescriptor>> userCredentials = new HashMap<>();

    // 사용자 이름과 그에 대한 고유 식별자(User Handle) 저장소
    private final Map<String, ByteArray> userHandles = new HashMap<>();

    // 자격 증명 ID와 그에 대한 등록된 자격 증명(RegisteredCredential) 저장소
    private final Map<ByteArray, RegisteredCredential> credentials = new HashMap<>();

    @Override
    public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
        return userCredentials.getOrDefault(username, Set.of());
    }

    @Override
    public Optional<ByteArray> getUserHandleForUsername(String username) {
        return Optional.ofNullable(userHandles.get(username));
    }

    @Override
    public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
        return userHandles.entrySet().stream()
                .filter(entry -> entry.getValue().equals(userHandle))
                .map(Map.Entry::getKey)
                .findFirst();
    }

    @Override
    public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
        return Optional.ofNullable(credentials.get(credentialId));
    }

    @Override
    public Set<RegisteredCredential> lookupAll(ByteArray userHandle) {
        return credentials.values().stream()
                .filter(credential -> credential.getUserHandle().equals(userHandle))
                .collect(Collectors.toSet());
    }
    // 사용자 이름과 사용자 고유 식별자 저장
    public void saveUserHandle(String username, ByteArray userHandle) {
        userHandles.put(username, userHandle);
    }

    // 자격 증명 데이터 추가
    public void addCredential(RegisteredCredential credential) {
        credentials.put(credential.getCredentialId(), credential);
    }
}

