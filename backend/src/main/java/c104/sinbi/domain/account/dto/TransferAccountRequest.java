package c104.sinbi.domain.account.dto;

import c104.sinbi.common.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferAccountRequest {
    private Long accountId;
    private String toAccountNum;
    private BankTypeEnum toBankType;
    private Long transferAmount;
}
