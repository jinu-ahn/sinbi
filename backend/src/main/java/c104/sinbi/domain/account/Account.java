package c104.sinbi.domain.account;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.transactionhistory.TransactionHistory;
import c104.sinbi.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "bank_type", nullable = false)
    private BankTypeEnum bankType;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionHistory> transactionHistory = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
