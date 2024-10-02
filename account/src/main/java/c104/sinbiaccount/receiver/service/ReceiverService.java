package c104.sinbiaccount.receiver.service;

import c104.sinbiaccount.exception.AccountNotFoundException;
import c104.sinbiaccount.exception.ReceiverAlreadyExistsException;
import c104.sinbiaccount.exception.global.ApiResponse;
import c104.sinbiaccount.receiver.Receiver;
import c104.sinbiaccount.receiver.dto.ReceiverAccountListResponse;
import c104.sinbiaccount.receiver.dto.ReceiverEvent;
import c104.sinbiaccount.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbiaccount.receiver.repository.ReceiverRepository;
import c104.sinbiaccount.util.HeaderUtil;
import c104.sinbiaccount.util.KafkaProducerUtil;
import c104.sinbiaccount.util.VirtualAccountResponseHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReceiverService {
    private final ReceiverRepository receiverRepository;
    private final KafkaProducerUtil kafkaProducerUtil;
    private final VirtualAccountResponseHandler virtualAccountResponseHandler;
    private final HeaderUtil headerUtil;

    // 자주 사용할 계좌 등록
    @Transactional
    public void ReceiverAccountRegistration(ReceiverRegistrationRequest receiverRegistrationRequest) {
        String requestId = UUID.randomUUID().toString();  // 요청마다 고유한 ID 생성
        Map<String, Object> accountNumAndBankTypeMap = new HashMap<>();
        accountNumAndBankTypeMap.put("accountNum", receiverRegistrationRequest.getAccountNum());
        accountNumAndBankTypeMap.put("bankType", receiverRegistrationRequest.getBankTypeEnum());

        kafkaProducerUtil.sendAccountNumAndBankType(ApiResponse.success(accountNumAndBankTypeMap, "SUCCESS", requestId));
        virtualAccountResponseHandler.createCompletableFuture(requestId);  // CompletableFuture 생성

        try {
            virtualAccountResponseHandler.getCompletableFuture(requestId).get(5, TimeUnit.SECONDS);

            Optional<Receiver> existingReceiver = receiverRepository.findByRecvAccountNumAndBankTypeEnum(
                    receiverRegistrationRequest.getAccountNum(),
                    receiverRegistrationRequest.getBankTypeEnum()
            );

            // 이미 등록된 계좌이면 ReceiverAlreadyExistsException 예외 발생
            if (existingReceiver.isPresent()) {
                throw new ReceiverAlreadyExistsException();
            }

            Receiver receiver = new Receiver(
                    receiverRegistrationRequest.getRecvName(),
                    receiverRegistrationRequest.getBankTypeEnum(),
                    receiverRegistrationRequest.getAccountNum(),
                    receiverRegistrationRequest.getRecvAlias()
            );
            receiverRepository.save(receiver);

            // 이벤트 발행: Receiver 등록 후 Redis 갱신을 위해 이벤트 전송
            ReceiverAccountListResponse receiverResponse = new ReceiverAccountListResponse(
                    receiver.getId(),
                    receiver.getRecvName(),
                    receiver.getRecvAccountNum(),
                    receiver.getBankTypeEnum(),
                    receiver.getRecvAlias()
            );
            ReceiverEvent event = new ReceiverEvent("RECEIVER_REGISTERED", receiver.getUserPhone(), receiverResponse);
            kafkaProducerUtil.sendReceiverEvent(ApiResponse.success(event, "SUCCESS"));
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.info(e.getMessage());
            throw new AccountNotFoundException();
        }
    }

    // 자주 사용할 계좌 삭제
    @Transactional
    public void deleteReceiverAccount(Long receiverId) {
        Receiver receiver = receiverRepository.findById(receiverId)
                .orElseThrow(() -> new AccountNotFoundException());
        receiverRepository.delete(receiver);

        // 이벤트 발행: Receiver 삭제 후 Redis 갱신을 위해 이벤트 전송
        ReceiverEvent event = new ReceiverEvent("RECEIVER_DELETED", receiver.getUserPhone(), receiverId);
        kafkaProducerUtil.sendReceiverEvent(ApiResponse.success(event, "SUCCESS"));
    }

    // 명령(Command) 사이드의 DB 전용 조회 메서드 (Query Side에서 사용)
    public List<ReceiverAccountListResponse> getReceiverAccountListFromDB(String userPhone) {
        return receiverRepository.findByUserPhone(userPhone)
                .stream()
                .map(receiver -> new ReceiverAccountListResponse(
                        receiver.getId(),
                        receiver.getRecvName(),
                        receiver.getRecvAccountNum(),
                        receiver.getBankTypeEnum(),
                        receiver.getRecvAlias()
                )).collect(Collectors.toList());
    }
}
