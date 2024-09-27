package c104.sinbireceiver.virtualaccount.repository;

import c104.sinbireceiver.constant.BankTypeEnum;
import c104.sinbireceiver.virtualaccount.VirtualAccount;
import c104.sinbireceiver.virtualaccount.dto.VirtualAccountDto;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
    Optional<VirtualAccountDto> findByAccountNumAndBankType(String AccountNum, BankTypeEnum BankType);

    @Modifying
    @Query("UPDATE VirtualAccount as v SET v.amount = v.amount + :amount WHERE v.Id = :id")
    int deposit(@Param("id") Long id, @Param("amount") Long amount);
}
