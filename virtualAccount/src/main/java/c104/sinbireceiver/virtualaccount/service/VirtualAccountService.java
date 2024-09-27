package c104.sinbireceiver.virtualaccount.service;

import c104.sinbireceiver.constant.BankTypeEnum;
import c104.sinbireceiver.constant.ErrorCode;
import c104.sinbireceiver.exception.AccountNotFoundException;
import c104.sinbireceiver.exception.DepositFailedException;
import c104.sinbireceiver.exception.IllgalArgumentException;
import c104.sinbireceiver.exception.global.ApiResponse;
import c104.sinbireceiver.util.KafkaProducerUtil;
import c104.sinbireceiver.virtualaccount.VirtualAccount;
import c104.sinbireceiver.virtualaccount.dto.AccountCreateRequest;
import c104.sinbireceiver.virtualaccount.dto.DepositRequestDto;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountCheckRequest;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountDto;
import c104.sinbireceiver.virtualaccount.repository.VirtualAccountRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VirtualAccountService {
    private final ObjectMapper objectMapper;
    private final VirtualAccountRepository virtualAccountRepository;
    private final KafkaProducerUtil kafkaProducerUtil;


    // 상대방 계좌 조회(Kafka)
    @KafkaListener(topics = "${spring.kafka.topics.first-find-virtual-account}", groupId = "${spring.kafka.consumer.group-id}")
    public void VirtualAccountCheckKafka(ApiResponse<AccountCreateRequest> response) throws JsonProcessingException {
        JsonNode jsonNode = objectMapper.readTree(response.toJson());
        Optional<VirtualAccountDto> virtualAccount = virtualAccountRepository.findByAccountNumAndBankType(
                jsonNode.get("data").get("accountNum").textValue(),
                BankTypeEnum.valueOf(jsonNode.get("data").get("bankType").textValue()));

        if (virtualAccount.isPresent()) {
            kafkaProducerUtil.sendFindVirtualAccount(
                    ApiResponse.success(VirtualAccountDto.builder()
                            .id(virtualAccount.get().getId())
                            .accountNum(virtualAccount.get().getAccountNum())
                            .amount(virtualAccount.get().getAmount())
                            .userName(virtualAccount.get().getUserName())
                            .bankType(virtualAccount.get().getBankType())
                            .productName(virtualAccount.get().getProductName())
                            .build(), "SUCCESS"));

            return;
        }
        kafkaProducerUtil.sendFindVirtualAccount(ApiResponse.error(ErrorCode.NOT_FOUND_ACCOUNT.getMessage()));
    }

    //상대방 계좌 조회
    public VirtualAccountDto VirtualAccountCheck(VirtualAccountCheckRequest virtualAccountCheckRequest) {
        VirtualAccountDto virtualAccount = virtualAccountRepository.findByAccountNumAndBankType(
                        virtualAccountCheckRequest.getAccountNum(),
                        virtualAccountCheckRequest.getBankTypeEnum())
                .orElseThrow(() -> new AccountNotFoundException());

        return virtualAccount;
    }
    

    //계좌 이체
    @Transactional
    public void deposit(DepositRequestDto depositRequestDto) {
        try {
            Long id = depositRequestDto.getId();
            Long transferAmount = depositRequestDto.getTransferAmount();

            // 가상 계좌에 금액을 입금 시도
            int rowsUpdated = virtualAccountRepository.deposit(id, transferAmount);

            // 입금 성공 시 Kafka 메시지 전송
            if (rowsUpdated > 0) {
                kafkaProducerUtil.sendCompletDeposit(ApiResponse.success("SUCCESS"));
            } else {
                // 입금 실패 시 Kafka로 에러 메시지 전송
                String errorMessage = "입금 처리에 실패했습니다.";
                kafkaProducerUtil.sendCompletDeposit(ApiResponse.error(errorMessage));

                // 예외 발생시 예외를 던져 상위 로직에서 처리
                throw new DepositFailedException(errorMessage);
            }
        } catch (Exception e) {
            log.error("입금 실패: {}", e.getMessage());

            // 입금 실패 시 Kafka로 에러 메시지 전송
            kafkaProducerUtil.sendCompletDeposit(ApiResponse.error("입금 실패: " + e.getMessage()));
            throw new DepositFailedException(); // 예외를 다시 던져서 상위 계층에서 처리
        }
    }
}
