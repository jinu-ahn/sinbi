package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.account.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveTransactionHistoryRequest {
    private Account fromAccount;
    private CommandVirtualAccountDto toVirtualAccount;
    private Long transferAmount;
}
