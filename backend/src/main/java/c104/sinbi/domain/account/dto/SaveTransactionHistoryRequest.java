package c104.sinbi.domain.account.dto;

import c104.sinbi.domain.account.Account;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveTransactionHistoryRequest {
    private Account fromAccount;
    private VirtualAccount toVirtualAccount;
    private Long transferAmount;
}
