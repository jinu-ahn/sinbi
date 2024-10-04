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
    @Query("SELECT new c104.sinbireceiver.virtualaccount.dto.VirtualAccountDto(v.Id, v.accountNum, v.amount, v.userName, v.bankType, v.productName, v.userPhone, v.virtualAccountPassword) " +
            "FROM VirtualAccount v WHERE v.accountNum = :accountNum AND v.bankType = :bankType")
    Optional<VirtualAccountDto> findByAccountNumAndBankType(String accountNum, BankTypeEnum bankType);
    @Modifying
    @Query("UPDATE VirtualAccount as v SET v.amount = v.amount + :amount WHERE v.Id = :id")
    int deposit(@Param("id") Long id, @Param("amount") Long amount);
}
