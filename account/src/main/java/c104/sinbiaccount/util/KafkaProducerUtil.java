package c104.sinbiaccount.util;

import c104.sinbiaccount.exception.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerUtil<K, V> {
    @Value("${spring.kafka.topics.first-find-virtual-account}")
    private String firstFindVirtualAccountTopic;

    @Value("${spring.kafka.topics.first-virtual-account-authenticate}")
    private String firstVirtualAccountAuthenticate;

    @Value("${spring.kafka.topics.first-deposit}")
    private String firstDepositTopic;

    @Value("${spring.kafka.topics.account-events}") // 새로 추가
    private String accountEventsTopic;

    @Value("${spring.kafka.topics.receiver-events}")
    private String receiverEventsTopic;

    private final KafkaTemplate<K, ApiResponse<?>> kafkaTemplate;

    /**
     * 가상계좌에 대한 값을 가져오는 토픽에 메시지를 전송합니다.
     *
     * @param value 메시지 값
     */
    public void sendAccountNumAndBankType(ApiResponse<?> value) {
        log.info("Sending Kafka message: {}", value); // 메시지 확인
        kafkaTemplate.send(firstFindVirtualAccountTopic, value);
    }

    /**
     * 가상계좌에 계좌 비밀번호 인증을 보냅니다.
     *
     * @param value 메시지 값
     */
    public void sendVirtualAccountAuthenticate(ApiResponse<?> value) {
        log.info("Sending Kafka message: {}", value); // 메시지 확인
        kafkaTemplate.send(firstVirtualAccountAuthenticate, value);
    }

    /**
     * 입금에 대한 토픽에 메시지를 전송합니다.
     *
     * @param value 메시지 값
     */
    public void sendDeposit(ApiResponse<?> value) {
        kafkaTemplate.send(firstDepositTopic, value);
    }

    /**
     * 계좌 관련 이벤트를 발행합니다.
     *
     * @param event AccountEvent 객체
     */
    public void sendAccountEvent(ApiResponse<?> event) {
        kafkaTemplate.send(accountEventsTopic, event);
    }

    /**
     * Receiver 관련 이벤트를 발행합니다.
     *
     * @param event ReceiverEvent 객체
     */
    public void sendReceiverEvent(ApiResponse<?> event) {
        kafkaTemplate.send(receiverEventsTopic, event);
    }
}
