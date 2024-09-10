package c104.sinbi.domain.receiver.dto;

import c104.sinbi.common.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiverRegistrationRequest {
    private String recvName;
    private String accountNum;
    private BankTypeEnum bankTypeEnum;
    private String recvAlias;
}
