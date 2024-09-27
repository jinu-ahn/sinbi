package c104.sinbiaccount.receiver;

import c104.sinbiaccount.constant.BankTypeEnum;
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

    @Column(name = "user_phone")
    private String userPhone;

    public Receiver(String recvName, BankTypeEnum bankTypeEnum, String recvAccountNum, String recvAlias) {
        this.recvName = recvName;
        this.bankTypeEnum = bankTypeEnum;
        this.recvAccountNum = recvAccountNum;
        this.recvAlias = recvAlias;
    }
}
