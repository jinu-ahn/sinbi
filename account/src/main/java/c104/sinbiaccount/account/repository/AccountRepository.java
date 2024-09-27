package c104.sinbiaccount.account.repository;

import c104.sinbiaccount.account.Account;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUserPhone(String userPhone);

    Optional<Account> findByAccountNum(String accountNum);

    Optional<Account> findById(Long accountId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account as a WHERE a.id = :accountId")
    Optional<Account> findByAccountIdWithLock(@Param("accountId") Long accountId);

    @Modifying
    @Query("UPDATE Account a SET a.amount = a.amount - :amount WHERE a.id = :accountId AND a.amount >= :amount")
    int withdraw(@Param("accountId") Long accountId, @Param("amount") Long amount);

    // 출금 롤백: 출금 취소 시 금액 복구
    @Modifying
    @Query("UPDATE Account a SET a.amount = a.amount + :transferAmount WHERE a.id = :accountId")
    int credit(@Param("accountId") Long accountId, @Param("transferAmount") Long transferAmount);
}
