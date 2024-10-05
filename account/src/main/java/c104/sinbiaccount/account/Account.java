package c104.sinbiaccount.account;

import c104.sinbiaccount.constant.BankTypeEnum;
import c104.sinbiaccount.transactionhistory.TransactionHistory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "Account")
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

    @Column(name = "user_phone", nullable = false)
    private String userPhone;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionHistory> transactionHistory = new ArrayList<>();

    // 새로운 생성자 추가
    public Account(String accountNum, BankTypeEnum bankType, Long amount, String productName, String userName, String userPhone) {
        this.accountNum = accountNum;
        this.bankType = bankType;
        this.amount = amount;
        this.productName = productName;
        this.userName = userName;
        this.userPhone = userPhone;
    }
}
