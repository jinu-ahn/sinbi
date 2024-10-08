package c104.sinbi.domain.virtualaccount.repository;

import c104.sinbi.common.constant.BankTypeEnum;
import c104.sinbi.domain.virtualaccount.VirtualAccount;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
    Optional<VirtualAccount> findByAccountNumAndBankType(String AccountNum, BankTypeEnum BankType);

    @Modifying
    @Query("UPDATE VirtualAccount as v SET v.amount = v.amount + :amount WHERE v.Id = :id")
    void deposit(@Param("id") Long id, @Param("amount") Long amount);
}
