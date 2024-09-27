package c104.sinbiaccount.account.dto;

import c104.sinbiaccount.constant.BankTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VirtualAccountDto {
    private Long id;
    private String accountNum;
    private BankTypeEnum bankType;
    private Long amount;
    private String productName;
    private String userName;
    private String userPhone;

    @Builder
    public VirtualAccountDto(Long id, String accountNum, BankTypeEnum bankType, Long amount, String productName, String userName, String userPhone) {
        this.id = id;
        this.accountNum = accountNum;
        this.bankType = bankType;
        this.amount = amount;
        this.productName = productName;
        this.userName = userName;
        this.userPhone = userPhone;
    }
}
