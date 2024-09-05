package c104.sinbi.domain.transactionhistory;

import c104.sinbi.common.BaseTimeEntity;
import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.account.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AttributeOverride(name = "createdAt", column = @Column(name = "history_date"))
public class TransactionHistory extends BaseTimeEntity {

    @Id
    @Column(name = "transaction_history_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_history_type", nullable = false)
    private String transactionHistoryType;

    @Column(name = "recv_account_num", nullable = false)
    private String recvAccountNum;

    @Column(name = "recv_account_name", nullable = false)
    private String recvAccountName;

    @Column(name = "transfer_amount", nullable = false)
    private String transferAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "bank_type", nullable = false)
    private BankTypeEnum bankType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
}
