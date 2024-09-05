package c104.sinbi.domain.transactionhistory;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class TransactionHistory {

    @Id
    @Column(name = "transaction_history_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_history_type")
    private String transactionHistoryType;

    @Column(name = "recv_account_num")
    private String recvAccountNum;

    @Column(name = "recv_account_name")
    private String recvAccountName;

    @Column(name = "transfer_amount")
    private String transferAmount;

    @Column(name = "bank_type")
    private String bankType;
}
