package c104.sinbireceiver.virtualaccount.dto;

import c104.sinbireceiver.constant.BankTypeEnum;
import lombok.*;

@Data
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
    private String userPhone;
    private int virtualPassword;

    public VirtualAccountDto(Long id, String accountNum, Long amount, String userName, BankTypeEnum bankType, String productName, String userPhone, int virtualPassword) {
        this.id = id;
        this.accountNum = accountNum;
        this.amount = amount;
        this.userName = userName;
        this.bankType = bankType;
        this.productName = productName;
        this.userPhone = userPhone;
        this.virtualPassword = virtualPassword;
    }
}
