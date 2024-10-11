package c104.sinbiaccount.receiver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiverAccountListView {
    private String userPhone;
    private List<ReceiverAccountListResponse> receivers;
}
