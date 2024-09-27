package c104.sinbireceiver.virtualaccount.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepositRequestDto {
    @JsonProperty("id")
    private Long Id;
    @JsonProperty("transferAmount")
    private Long transferAmount;
}
