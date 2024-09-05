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

    @Column(name = "transaction_history_type", nullable = false)
    private String transactionHistoryType;

    @Column(name = "recv_account_num", nullable = false)
    private String recvAccountNum;

    @Column(name = "recv_account_name", nullable = false)
    private String recvAccountName;

    @Column(name = "transfer_amount", nullable = false)
    private String transferAmount;

    @Column(name = "bank_type", nullable = false)
    private String bankType;
}
