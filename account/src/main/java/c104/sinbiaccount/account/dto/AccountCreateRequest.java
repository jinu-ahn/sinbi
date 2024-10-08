package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountCreateRequest {
    private String accountNum;
    private BankTypeEnum bankType;
}
