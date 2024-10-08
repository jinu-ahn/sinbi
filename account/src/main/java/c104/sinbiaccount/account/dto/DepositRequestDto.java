package c104.sinbiaccount.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepositRequestDto {
    private Long Id;
    private Long transferAmount;
}
