package c104.sinbiaccount.receiver.dto;

import c104.sinbiaccount.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiverAccountListResponse {
    private Long id;
    private String recvName;
    private String recvAccountNum;
    private BankTypeEnum bankType;
    private String recvAlias;
}
