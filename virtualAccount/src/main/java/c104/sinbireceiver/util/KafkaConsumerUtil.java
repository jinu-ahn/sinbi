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

    @Transactional
    @KafkaListener(topics = "${spring.kafka.topics.first-deposit}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenDeposit(ApiResponse<DepositRequestDto> response) throws JsonProcessingException {
        String requestId = response.getRequestId();
        JsonNode node = objectMapper.readTree(response.toJson());
        DepositRequestDto depositRequestDto = new DepositRequestDto(
                node.get("data").get("requestId").asText(),
                node.get("data").get("id").asLong(),
                node.get("data").get("transferAmount").asLong()
        );
        if (depositRequestDto != null) {
            virtualAccountService.deposit(depositRequestDto);
        } else {
            log.info("Dto is null");
        }
    }

    @Transactional
    @KafkaListener(topics = "${spring.kafka.topics.first-virtual-account-authenticate}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenVirtualAccountAuthenticate(ApiResponse<VirtualAccountAuthenticateDto> response) throws JsonProcessingException {
        String requestId = response.getRequestId();
        JsonNode node = objectMapper.readTree(response.toJson());

        log.info("BankTypeEnum : {}",BankTypeEnum.valueOf(node.get("data").get("bankTypeEnum").asText()));
        VirtualAccountAuthenticateDto virtualAccountAuthenticateDto = new VirtualAccountAuthenticateDto(
                node.get("data").get("requestId").asText(),
                node.get("data").get("accountNum").asText(),
                BankTypeEnum.valueOf(node.get("data").get("bankTypeEnum").asText()),
                node.get("data").get("password").asInt()
        );
        if (virtualAccountAuthenticateDto != null) {
            virtualAccountService.authenticate(virtualAccountAuthenticateDto);
        } else {
            log.info("Dto is null");
        }
    }
}
