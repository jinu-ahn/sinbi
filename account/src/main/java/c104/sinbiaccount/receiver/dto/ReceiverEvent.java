package c104.sinbiaccount.receiver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiverEvent {
    private String eventType;
    private String userPhone;
    private Object data;
}
