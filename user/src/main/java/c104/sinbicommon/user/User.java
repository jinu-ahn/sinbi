package c104.sinbicommon.user;

import c104.sinbicommon.BaseTimeEntity;
import c104.sinbicommon.user.dto.SignUpDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity (name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity implements UserDetails {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_phone", nullable = false)
    private String userPhone;

    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name = "user_face_id")
    private String userFaceId;

    @ElementCollection
    private List<String> roles;

    @Builder
    public User(SignUpDto signUpDto, String encodedPassword, String convertImageUrl) {
        this.userName = signUpDto.getUserName();
        this.userPhone = signUpDto.getUserPhone();
        this.userPassword = encodedPassword;
        if (convertImageUrl != null)
            this.userFaceId = convertImageUrl;
        this.roles = Collections.singletonList("USER");
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.userPassword;
    }

    @Override
    public String getUsername() {
        return this.userPhone;
    }

    public String getName() {
        return this.userName;
    }
}
