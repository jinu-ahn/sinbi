package c104.sinbireceiver.virtualaccount.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepositRequestDto {
    @JsonProperty("requestId")
    private String requestId;        // 요청을 구분할 수 있는 requestId 추가
    @JsonProperty("id")
    private Long id;
    @JsonProperty("transferAmount")
    private Long transferAmount;
}
