package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAccountListResponse {
    private Long id;
    private String accountNum;
    private BankTypeEnum bankType;
    private Long amount;
    private String productName;
}
