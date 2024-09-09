package c104.sinbi.domain.user;

import c104.sinbi.common.BaseTimeEntity;
import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.receiver.Receiver;
import c104.sinbi.domain.user.dto.SignUpDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accountList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Receiver> receiverList = new ArrayList<>();

    @Builder
    public User(SignUpDto signUpDto, String encodedPassword, String convertImageUrl) {
        this.userName = signUpDto.getUserName();
        this.userPhone = signUpDto.getUserPhone();
        this.userPassword = encodedPassword;
        if(convertImageUrl != null)
            this.userFaceId = convertImageUrl;
    }
}
