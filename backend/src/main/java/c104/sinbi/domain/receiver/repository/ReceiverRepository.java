package c104.sinbi.domain.receiver.repository;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.receiver.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReceiverRepository extends JpaRepository<Receiver, Long> {
    Optional<Receiver> findByRecvAccountNumAndBankTypeEnum(String accountNum, BankTypeEnum bankTypeEnum);
}
