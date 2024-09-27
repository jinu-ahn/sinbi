package c104.sinbireceiver.util;


import c104.sinbireceiver.exception.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaProducerUtil<K, T> {
    @Value("${spring.kafka.topics.second-find-virtual-account}")
    private String secondFindVirtualAccountTopic;

    @Value("${spring.kafka.topics.second-deposit}")
    private String depositTopic;

    private final KafkaTemplate<K, ApiResponse<?>> kafkaTemplate;

    /**
     * 가상계좌에 대한 값을 가져오는 토픽에 메시지를 전송합니다.
     *
     * @param value   메시지 값
     */
    public void sendFindVirtualAccount(ApiResponse<?> value) {
        kafkaTemplate.send(secondFindVirtualAccountTopic, value);
    }

    /**
     * 가상계좌에 대한 값을 가져오는 토픽에 메시지를 전송합니다.
     *
     * @param value   메시지 값
     */
    public void sendCompletDeposit(ApiResponse<?> value) {
        kafkaTemplate.send(depositTopic, value);
    }

}

