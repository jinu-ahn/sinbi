package c104.sinbi.domain.virtualaccount.dto;

import c104.sinbi.common.constant.BankTypeEnum;
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
