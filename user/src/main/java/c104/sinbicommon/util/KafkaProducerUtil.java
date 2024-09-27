package c104.sinbicommon.util;

import c104.sinbicommon.exception.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaProducerUtil<K, V> {

    @Value("${spring.kafka.topics.second-reissue}")
    private String secondReissueTopic;

    private final KafkaTemplate<K, ApiResponse<?>> kafkaTemplate;

    public void sendReissue(ApiResponse<?> value) {
        kafkaTemplate.send(secondReissueTopic,value);
    }
}

