package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.transactionhistory.dto.TransactionHistoryResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDetailView {
    private Long accountId;
    private List<TransactionHistoryResponse> transactionHistory;
}
