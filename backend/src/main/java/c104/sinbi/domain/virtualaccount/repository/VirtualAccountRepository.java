package c104.sinbi.domain.virtualaccount.repository;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
    Optional<VirtualAccount> findByAccountNumAndBankType(String AccountNum, BankTypeEnum BankType);
}
