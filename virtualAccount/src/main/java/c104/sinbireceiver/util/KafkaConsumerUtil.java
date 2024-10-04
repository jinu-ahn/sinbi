package c104.sinbireceiver.util;

import c104.sinbireceiver.constant.BankTypeEnum;
import c104.sinbireceiver.exception.global.ApiResponse;
import c104.sinbireceiver.virtualaccount.dto.DepositRequestDto;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountAuthenticateDto;
import c104.sinbireceiver.virtualaccount.service.VirtualAccountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class KafkaConsumerUtil {

    private final ObjectMapper objectMapper;
    private final VirtualAccountService virtualAccountService;

    @Transactional
    @KafkaListener(topics = "${spring.kafka.topics.first-deposit}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenDeposit(ApiResponse<DepositRequestDto> response) throws JsonProcessingException {
        String requestId = response.getRequestId();
        JsonNode node = objectMapper.readTree(response.toJson());
        DepositRequestDto depositRequestDto = new DepositRequestDto(
                requestId,
                node.get("data").get("id").asLong(),
                node.get("data").get("transferAmount").asLong()
        );
        if (depositRequestDto != null) {
            virtualAccountService.deposit(depositRequestDto);
        } else {
        }
    }

    @Transactional
    @KafkaListener(topics = "${spring.kafka.topics.first-virtual-account-authenticate}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenVirtualAccountAuthenticate(ApiResponse<VirtualAccountAuthenticateDto> response) throws JsonProcessingException {
        String requestId = response.getRequestId();
        JsonNode node = objectMapper.readTree(response.toJson());

        VirtualAccountAuthenticateDto virtualAccountAuthenticateDto = new VirtualAccountAuthenticateDto(
                requestId,
                node.get("data").get("accountNum").asText(),
                BankTypeEnum.valueOf(node.get("data").get("bankTypeEnum").asText()),
                node.get("data").get("virtualAccountPassword").asInt()
        );
        if (virtualAccountAuthenticateDto != null) {
            virtualAccountService.authenticate(virtualAccountAuthenticateDto);
        } else {

        }
    }
}
