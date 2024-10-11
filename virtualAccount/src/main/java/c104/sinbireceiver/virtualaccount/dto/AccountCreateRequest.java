package c104.sinbireceiver.virtualaccount.dto;

import c104.sinbireceiver.constant.BankTypeEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountCreateRequest {
    private String accountNum;
    private BankTypeEnum bankType;
}
