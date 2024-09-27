package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.account.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RollBackDto {
    private Long accountId;
    private Long transferAmount;
    private Account fromAccount;
}
