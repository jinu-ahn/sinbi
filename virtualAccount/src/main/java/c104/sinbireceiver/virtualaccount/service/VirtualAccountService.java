package c104.sinbireceiver.virtualaccount.service;

import c104.sinbireceiver.constant.BankTypeEnum;
import c104.sinbireceiver.constant.ErrorCode;
import c104.sinbireceiver.exception.AccountNotFoundException;
import c104.sinbireceiver.exception.DepositFailedException;
import c104.sinbireceiver.exception.global.ApiResponse;
import c104.sinbireceiver.util.KafkaProducerUtil;
import c104.sinbireceiver.virtualaccount.dto.*;
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
    private final KafkaProducerUtil<String, ApiResponse<?>> kafkaProducerUtil;

    // 상대방 계좌 조회(Kafka)
    @KafkaListener(topics = "${spring.kafka.topics.first-find-virtual-account}", groupId = "${spring.kafka.consumer.group-id}")
    public void VirtualAccountCheckKafka(ApiResponse<AccountCreateRequest> response) throws JsonProcessingException {
        String requestId = response.getRequestId(); // requestId 추출
        JsonNode jsonNode = objectMapper.readTree(response.toJson());
        log.info("{}",BankTypeEnum.valueOf(jsonNode.get("data").get("bankType").textValue()));
        Optional<VirtualAccountDto> virtualAccount = virtualAccountRepository.findByAccountNumAndBankType(
                jsonNode.get("data").get("accountNum").textValue(),
                BankTypeEnum.valueOf(jsonNode.get("data").get("bankType").textValue()));

        log.info("data {}", virtualAccount);

        if (virtualAccount.isPresent()) {
            log.info("in");
            kafkaProducerUtil.sendFindVirtualAccount(
                    requestId,
                    ApiResponse.success(
                            VirtualAccountDto.builder()
                                    .id(virtualAccount.get().getId())
                                    .accountNum(virtualAccount.get().getAccountNum())
                                    .amount(virtualAccount.get().getAmount())
                                    .userName(virtualAccount.get().getUserName())
                                    .bankType(virtualAccount.get().getBankType())
                                    .productName(virtualAccount.get().getProductName())
                                    .userPhone(virtualAccount.get().getUserPhone())
                                    .virtualPassword(virtualAccount.get().getVirtualPassword())
                                    .build(),
                            "SUCCESS")
            );
        } else {
            kafkaProducerUtil.sendFindVirtualAccount(
                    requestId,
                    ApiResponse.error(ErrorCode.NOT_FOUND_ACCOUNT.getMessage())
            );
        }
    }

    // 계좌 인증
    public void authenticate(VirtualAccountAuthenticateDto virtualAccountAuthenticateDto) {
        String requestId = virtualAccountAuthenticateDto.getRequestId(); // 요청에서 requestId 추출

        Optional<VirtualAccountDto> optionalVirtualAccount = virtualAccountRepository.findByAccountNumAndBankType(
                virtualAccountAuthenticateDto.getVirtualAccountNum(),
                virtualAccountAuthenticateDto.getBankTypeEnum());

        if (optionalVirtualAccount.isEmpty()) {
            String errorMessage = "해당 계좌를 찾을 수 없습니다.";
            kafkaProducerUtil.sendCheckAccount(requestId, ApiResponse.error(errorMessage));
        } else {
            VirtualAccountDto virtualAccount = optionalVirtualAccount.get();
            if (virtualAccount.getVirtualPassword() == (virtualAccountAuthenticateDto.getPassword())) {
                kafkaProducerUtil.sendCheckAccount(requestId, ApiResponse.success("SUCCESS"));
            } else {
                String errorMessage = "계좌 비밀번호가 다릅니다.";
                kafkaProducerUtil.sendCheckAccount(requestId, ApiResponse.error(errorMessage));
            }
        }
    }

    // 상대방 계좌 조회
    public VirtualAccountDto VirtualAccountCheck(VirtualAccountCheckRequest virtualAccountCheckRequest) {
        return virtualAccountRepository.findByAccountNumAndBankType(
                        virtualAccountCheckRequest.getAccountNum(),
                        virtualAccountCheckRequest.getBankTypeEnum())
                .orElseThrow(() -> new AccountNotFoundException());
    }

    // 계좌 이체
    @Transactional
    public void deposit(DepositRequestDto depositRequestDto) {
        String requestId = depositRequestDto.getRequestId(); // 요청에서 requestId 추출

        try {
            Long id = depositRequestDto.getId();
            Long transferAmount = depositRequestDto.getTransferAmount();

            int rowsUpdated = virtualAccountRepository.deposit(id, transferAmount);

            if (rowsUpdated > 0) {
                kafkaProducerUtil.sendCompletDeposit(requestId, ApiResponse.success("SUCCESS"));
            } else {
                String errorMessage = "입금 처리에 실패했습니다.";
                kafkaProducerUtil.sendCompletDeposit(requestId, ApiResponse.error(errorMessage));
                throw new DepositFailedException(errorMessage);
            }
        } catch (Exception e) {
            log.error("입금 실패: {}", e.getMessage());
            kafkaProducerUtil.sendCompletDeposit(requestId, ApiResponse.error("입금 실패: " + e.getMessage()));
            throw new DepositFailedException();
        }
    }
}
