package c104.sinbi.domain.virtualaccount.service;

import c104.sinbi.common.exception.AccountNotFoundException;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import c104.sinbi.domain.virtualaccount.dto.VirtualAccountCheckRequest;
import c104.sinbi.domain.virtualaccount.repository.VirtualAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VirtualAccountService {

    private final VirtualAccountRepository virtualAccountRepository;

    //상대방 계좌 조회
    public void VirtualAccountCheck(VirtualAccountCheckRequest virtualAccountCheckRequest) {
        virtualAccountRepository.findByAccountNumAndBankType(
                virtualAccountCheckRequest.getAccountNum(),
                virtualAccountCheckRequest.getBankTypeEnum())
                .orElseThrow(() -> new AccountNotFoundException());
    }
}
