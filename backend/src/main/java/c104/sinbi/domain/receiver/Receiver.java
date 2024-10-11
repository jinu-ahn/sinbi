package c104.sinbi.domain.receiver;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Receiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recv_id")
    private Long id;

    @Column(name = "recv_name", nullable = false)
    private String recvName;

    @Column(name = "recv_account_num", nullable = false)
    private String recvAccountNum;

    @Enumerated(EnumType.STRING)
    @Column(name = "bank_type", nullable = false)
    private BankTypeEnum bankTypeEnum;

    @Column(name = "recv_alias")
    private String recvAlias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Receiver(String recvName, BankTypeEnum bankTypeEnum, String recvAccountNum, String recvAlias) {
        this.recvName = recvName;
        this.bankTypeEnum = bankTypeEnum;
        this.recvAccountNum = recvAccountNum;
        this.recvAlias = recvAlias;
    }
}
