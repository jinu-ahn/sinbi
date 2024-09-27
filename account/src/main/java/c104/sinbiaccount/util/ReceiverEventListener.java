package c104.sinbiaccount.util;

import c104.sinbiaccount.receiver.dto.ReceiverAccountListResponse;
import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import c104.sinbiaccount.receiver.dto.ReceiverEvent;
import c104.sinbiaccount.receiver.repository.ReceiverQueryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiverEventListener {
    private final ReceiverQueryRepository receiverQueryRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${spring.kafka.topics.receiver-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void handleReceiverEvent(ReceiverEvent event) {
        try{
            switch (event.getEventType()) {
                case "RECEIVER_REGISTERED":
                    ReceiverAccountListResponse newReceiver = objectMapper.convertValue(event.getData(), ReceiverAccountListResponse.class);
                    ReceiverAccountListView receiverAccountListView = receiverQueryRepository.getReceiverList(event.getUserPhone());
                    if(receiverAccountListView != null) {
                        receiverAccountListView.getReceivers().add(newReceiver);
                        receiverQueryRepository.saveReceiverList(event.getUserPhone(), receiverAccountListView);
                    }else{
                        // 캐시에 없으면 새로 저장
                        receiverAccountListView = new ReceiverAccountListView(event.getUserPhone(), List.of(newReceiver));
                        receiverQueryRepository.saveReceiverList(event.getUserPhone(), receiverAccountListView);
                    }
                    break;
                case "RECEIVER_DELETED":
                    Long deletedReceiverId = objectMapper.convertValue(event.getData(), Long.class);
                    //기존 캐시된 Receiver 목록에서 제거
                    ReceiverAccountListView listView = receiverQueryRepository.getReceiverList(event.getUserPhone());
                    if(listView != null) {
                        listView.getReceivers().removeIf(receiver -> receiver.getId().equals(deletedReceiverId));
                        receiverQueryRepository.saveReceiverList(event.getUserPhone(), listView);
                    }
                    break;
                default:
                    log.warn("Unknown event type: {}", event.getEventType());
            }
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }
}
