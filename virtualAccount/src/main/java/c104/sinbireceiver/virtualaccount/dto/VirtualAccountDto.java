package c104.sinbireceiver.virtualaccount.dto;

import c104.sinbireceiver.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VirtualAccountDto {
    private Long id;
    private String accountNum;
    private BankTypeEnum bankType;
    private Long amount;
    private String productName;
    private String userName;
}
