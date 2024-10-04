package c104.sinbiaccount.util;

import c104.sinbiaccount.account.dto.CommandVirtualAccountDto;
import c104.sinbiaccount.constant.BankTypeEnum;
import c104.sinbiaccount.exception.global.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ApiException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaConsumerUtil {
    private final ObjectMapper objectMapper;
    private final VirtualAccountResponseHandler virtualAccountResponseHandler;

    @KafkaListener(topics = "${spring.kafka.topics.second-find-virtual-account}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenFindVirtualAccount(ApiResponse<?> response) {
        String requestId = response.getRequestId();  // 요청 ID를 포함하도록 수정 필요
        if (response.getStatus().equals("SUCCESS")) {
            try {
                JsonNode jsonNode = objectMapper.readTree(response.toJson());

                CommandVirtualAccountDto commandVirtualAccountDto = CommandVirtualAccountDto.builder()
                        .id(jsonNode.get("data").get("id").asLong())
                        .accountNum(jsonNode.get("data").get("accountNum").textValue())
                        .bankType(BankTypeEnum.valueOf(jsonNode.get("data").get("bankType").textValue()))
                        .userName(jsonNode.get("data").get("userName").textValue())
                        .productName(jsonNode.get("data").get("productName").textValue())
                        .amount(jsonNode.get("data").get("amount").asLong())
                        .userPhone(jsonNode.get("data").get("userPhone").textValue())
                        .build();

                virtualAccountResponseHandler.complete(requestId, commandVirtualAccountDto);
            } catch (Exception e) {
                throw new ApiException(e.getMessage());
            }
        } else {
            virtualAccountResponseHandler.complete(requestId, response.getStatus());
        }
    }

    @KafkaListener(topics = "${spring.kafka.topics.second-deposit}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenDeposit(ApiResponse<?> response) {
        String requestId = response.getRequestId();  // 요청 ID를 포함하도록 수정 필요
        boolean isSuccess = response.getStatus().equals("SUCCESS");
        virtualAccountResponseHandler.complete(requestId, isSuccess);
    }

    @KafkaListener(topics = "${spring.kafka.topics.second-virtual-account-authenticate}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenAuthenticate(ApiResponse<?> response) {
        String requestId = response.getRequestId();  // 요청 ID를 포함하도록 수정 필요
        boolean isSuccess = response.getStatus().equals("SUCCESS");
        virtualAccountResponseHandler.complete(requestId, isSuccess);
    }
}