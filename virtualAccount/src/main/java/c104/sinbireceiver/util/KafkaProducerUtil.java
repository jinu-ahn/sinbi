package c104.sinbireceiver.util;

import c104.sinbireceiver.exception.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerUtil<K, T> {

    @Value("${spring.kafka.topics.second-find-virtual-account}")
    private String secondFindVirtualAccountTopic;

    @Value("${spring.kafka.topics.second-virtual-account-authenticate}")
    private String secondVirtualAccountAuthenticate;

    @Value("${spring.kafka.topics.second-deposit}")
    private String depositTopic;

    private final KafkaTemplate<K, ApiResponse<?>> kafkaTemplate;

    public void sendFindVirtualAccount(String requestId, ApiResponse<?> value) {
        log.info("receiver: {}",value);
        value.setRequestId(requestId);  // requestId 설정
        kafkaTemplate.send(secondFindVirtualAccountTopic, value);
    }

    public void sendCompletDeposit(String requestId, ApiResponse<?> value) {
        value.setRequestId(requestId);  // requestId 설정
        kafkaTemplate.send(depositTopic, value);
    }

    public void sendCheckAccount(String requestId, ApiResponse<?> value) {
        value.setRequestId(requestId);  // requestId 설정
        kafkaTemplate.send(secondVirtualAccountAuthenticate, value);
    }
}
