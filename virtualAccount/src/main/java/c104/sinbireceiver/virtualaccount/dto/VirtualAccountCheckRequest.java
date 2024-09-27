package c104.sinbireceiver.virtualaccount.dto;

import c104.sinbireceiver.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VirtualAccountCheckRequest {
    private String accountNum;
    private BankTypeEnum bankTypeEnum;
}
