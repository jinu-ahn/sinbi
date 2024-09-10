package c104.sinbi.domain.receiver.service;

import c104.sinbi.common.exception.AccountNotFoundException;
import c104.sinbi.common.exception.ReceiverAlreadyExistsException;
import c104.sinbi.domain.receiver.Receiver;
import c104.sinbi.domain.receiver.dto.ReceiverAccountListResponse;
import c104.sinbi.domain.receiver.dto.ReceiverRegistrationRequest;
import c104.sinbi.domain.receiver.repository.ReceiverRepository;
import c104.sinbi.domain.virtualaccount.repository.VirtualAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReceiverService {

    private final ReceiverRepository receiverRepository;
    private final VirtualAccountRepository virtualAccountRepository;

    //자주 사용할 계좌 등록
    @Transactional
    public void ReceiverAccountRegistration(ReceiverRegistrationRequest receiverRegistrationRequest) {
        // 가상계좌 테이블에 계좌가 존재하는지 확인
        virtualAccountRepository.findByAccountNumAndBankType(
                receiverRegistrationRequest.getAccountNum(),
                receiverRegistrationRequest.getBankTypeEnum()
        ).orElseThrow(() -> new AccountNotFoundException());

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
    }

    //자주 사용할 계좌 목록 보기
    public List<ReceiverAccountListResponse> receiverAccountList(Integer userId) {
        List<Receiver> receiverList = receiverRepository.findByUserId(userId);
        return receiverList.stream()
                .map(receiver -> new ReceiverAccountListResponse(
                        receiver.getId(),
                        receiver.getRecvAccountNum(),
                        receiver.getRecvName(),
                        receiver.getBankTypeEnum(),
                        receiver.getRecvAlias()
                )).collect(Collectors.toList());
    }
}
