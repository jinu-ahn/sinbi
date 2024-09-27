package c104.sinbiaccount.util;

import c104.sinbiaccount.account.dto.CommandVirtualAccountDto;
import c104.sinbiaccount.constant.BankTypeEnum;
import c104.sinbiaccount.exception.global.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerUtil {
    private final ObjectMapper objectMapper;
    private final VirtualAccountResponseHandler virtualAccountResponseHandler;
    /**
     * 가상계좌에 대한 값을 가져오는 토픽에 대한 리스너.
     */
    @KafkaListener(topics = "${spring.kafka.topics.second-find-virtual-account}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenFindVirtualAccount(ApiResponse<?> response) {
        if(response.getStatus().equals("SUCCESS")){
            try {
                JsonNode jsonNode = objectMapper.readTree(response.toJson());  // JSON 문자열을 JsonNode로 변환

                CommandVirtualAccountDto commandVirtualAccountDto = CommandVirtualAccountDto.builder()
                        .id(jsonNode.get("data").get("id").asLong())
                        .accountNum(jsonNode.get("data").get("accountNum").textValue())
                        .bankType(BankTypeEnum.valueOf(jsonNode.get("data").get("bankType").textValue()))
                        .userName(jsonNode.get("data").get("userName").textValue())
                        .productName(jsonNode.get("data").get("productName").textValue())
                        .amount(jsonNode.get("data").get("amount").asLong())
                        .userPhone(jsonNode.get("data").get("userPhone").textValue())
                        .build();

                virtualAccountResponseHandler.complete(commandVirtualAccountDto);
            } catch(Exception e) {
                log.info(e.getMessage());
            }
        } else {
            virtualAccountResponseHandler.complete(response.getStatus());
        }
    }


    /**
     * 입금에 대한 값을 가져오는 토픽에 대한 리스너.
     *
     * @param response 수신된 메시지
     */
    @KafkaListener(topics = "${spring.kafka.topics.second-deposit}", groupId = "${spring.kafka.consumer.group-id}")
    public boolean listenDeposit(ApiResponse<String> response) {
        return response.getStatus().equals("SUCCESS");
    }

    /**
     * 사용자 ID를 찾는 토픽에 대한 리스너.
     *
     * @param record 수신된 메시지
     */
    @KafkaListener(topics = "${spring.kafka.topics.second-find-user-id}", groupId = "${spring.kafka.consumer.group-id}")
    public Object listenFindUserId(ConsumerRecord<String, Object> record) {
        return record.value();
    }
}
