package c104.sinbiaccount.util;


import c104.sinbiaccount.exception.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaProducerUtil<K, V> {
    @Value("${spring.kafka.topics.first-find-virtual-account}")
    private String firstFindVirtualAccountTopic;

    @Value("${spring.kafka.topics.first-deposit}")
    private String firstDepositTopic;

    private final KafkaTemplate<K, ApiResponse<?>> kafkaTemplate;

    /**
     * 가상계좌에 대한 값을 가져오는 토픽에 메시지를 전송합니다.
     *
     * @param value   메시지 값
     */
    public void sendAccountNumAndBankType(ApiResponse<?> value) {
        kafkaTemplate.send(firstFindVirtualAccountTopic, value);
    }

    /**
     * 입금에 대한 토픽에 메시지를 전송합니다.
     *
     * @param value   메시지 값
     */
    public void sendDeposit(ApiResponse<?> value) {
        kafkaTemplate.send(firstDepositTopic, value);
    }

}

