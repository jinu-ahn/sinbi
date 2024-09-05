package c104.sinbi.domain.account;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {

    @Id
    @Column(name = "account_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_num", nullable = false)
    private String accountNum;

    @Column(name = "bank_type", nullable = false)
    private String bankType;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "user_name", nullable = false)
    private String userName;
}
