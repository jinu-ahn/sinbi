package c104.sinbi.domain.transactionhistory.dto;

import c104.sinbi.common.constant.BankTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionHistoryResponse {
    private Long id;
    private String transactionHistoryType;
    private String recvAccountNum;
    private String recvAccountName;
    private String transferAmount;
    private BankTypeEnum bankType;
    private String historyDate;
}
