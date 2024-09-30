package c104.sinbireceiver.util;

import c104.sinbireceiver.exception.global.ApiResponse;
import c104.sinbireceiver.virtualaccount.dto.DepositRequestDto;
import c104.sinbireceiver.virtualaccount.service.VirtualAccountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerUtil {

    private final ObjectMapper objectMapper;
    private final VirtualAccountService virtualAccountService;

    /**
     * 입금에 대한 값을 가져오는 토픽에 대한 리스너.
     *
     * @param response 수신된 메시지
     */
    @Transactional
    @KafkaListener(topics = "${spring.kafka.topics.first-deposit}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenDeposit(ApiResponse<DepositRequestDto> response) throws JsonProcessingException {
        JsonNode node = objectMapper.readTree(response.toJson());
        DepositRequestDto depositRequestDto = new DepositRequestDto(
                node.get("data").get("id").asLong(),
                node.get("data").get("transferAmount").asLong()
        );
        if (depositRequestDto != null) {
            virtualAccountService.deposit(depositRequestDto);
        } else {
            log.info("Dto is null");
        }
    }
}
