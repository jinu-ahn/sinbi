package c104.sinbireceiver.virtualaccount.dto;

import c104.sinbireceiver.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VirtualAccountAuthenticateDto {
    private String requestId;           // 요청을 구분할 수 있는 requestId 추가
    private String virtualAccountNum;
    private BankTypeEnum bankTypeEnum;
    private int password;
}
