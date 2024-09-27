package c104.sinbicommon.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
public class LoginDto {
    @NotNull
    private String phone;
    private String password;
    private MultipartFile faceId;

}
