package c104.sinbi.domain.receiver.repository;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.receiver.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReceiverRepository extends JpaRepository<Receiver, Long> {
    //자주 사용할 계좌 등록
    Optional<Receiver> findByRecvAccountNumAndBankTypeEnum(String accountNum, BankTypeEnum bankTypeEnum);

    //자주 사용할 계좌 목록 보기
    List<Receiver> findByUserId(Integer userId);
}
