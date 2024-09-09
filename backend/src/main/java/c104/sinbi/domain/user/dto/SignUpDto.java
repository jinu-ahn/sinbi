package c104.sinbi.domain.user.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/07
 * 설명 : 회원가입 Dto
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignUpDto {
    @NotNull
    private String userName;

    @NotNull
    @Pattern(regexp = "/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/", message = "전화번호는 01012345678 형식으로 작성해 주세요")
    private String userPhone;

    @NotNull
    @Pattern(regexp = "^[0-9]{4}$", message= "숫자 4자리로 입력해주세요.")
    @Size(min = 4, max = 4)
    private String userPassword;

}
