package c104.sinbiaccount.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountListView {
    private String userPhone;
    private List<GetAccountListResponse> accounts;
}
