package c104.sinbiaccount.util;

import c104.sinbiaccount.constant.BankTypeEnum;
import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.receiver.dto.ReceiverAccountListResponse;
import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import c104.sinbiaccount.receiver.dto.ReceiverEvent;
import c104.sinbiaccount.receiver.repository.ReceiverQueryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiverEventListener {
    private final ReceiverQueryRepository receiverQueryRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${spring.kafka.topics.receiver-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void handleReceiverEvent(ApiResponse<ReceiverEvent> event) {
        try {
            JsonNode jsonNode = objectMapper.readTree(event.toJson());
            String userPhone = jsonNode.get("data").get("userPhone").asText();
            switch (jsonNode.get("data").get("eventType").asText()) {
                case "RECEIVER_REGISTERED":
                    ReceiverAccountListResponse newReceiver = ReceiverAccountListResponse.builder()
                            .id(jsonNode.get("data").get("data").get("id").asLong())
                            .bankType(BankTypeEnum.valueOf(jsonNode.get("data").get("data").get("bankType").asText()))
                            .recvAccountNum(jsonNode.get("data").get("data").get("recvAccountNum").asText())
                            .recvName(jsonNode.get("data").get("data").get("recvName").asText())
                            .recvAlias(jsonNode.get("data").get("data").get("recvAlias").asText())
                            .build();
                    ReceiverAccountListView receiverAccountListView = receiverQueryRepository.getReceiverList(userPhone);
                    if (receiverAccountListView != null) {
                        receiverAccountListView.getReceivers().add(newReceiver);
                        receiverQueryRepository.saveReceiverList(userPhone, receiverAccountListView);
                    } else {
                        // 캐시에 없으면 새로 저장
                        receiverAccountListView = new ReceiverAccountListView(userPhone, List.of(newReceiver));
                        receiverQueryRepository.saveReceiverList(userPhone, receiverAccountListView);
                    }
                    break;
                case "RECEIVER_DELETED":
                    Long deletedReceiverId = objectMapper.convertValue(event.getData(), Long.class);
                    //기존 캐시된 Receiver 목록에서 제거
                    ReceiverAccountListView listView = receiverQueryRepository.getReceiverList(userPhone);
                    if (listView != null) {
                        listView.getReceivers().removeIf(receiver -> receiver.getId().equals(deletedReceiverId));
                        receiverQueryRepository.saveReceiverList(userPhone, listView);
                    }
                    break;
                default:
            }
        } catch (Exception e) {
        }
    }
}
