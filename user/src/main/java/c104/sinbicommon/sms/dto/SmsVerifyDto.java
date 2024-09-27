package c104.sinbicommon.sms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmsVerifyDto {

    @NotNull(message = "휴대폰 번호를 입력해주세요")
    private String phoneNum;

    @NotNull(message = "인증번호를 입력해주세요")
    private String certificationCode;
}
