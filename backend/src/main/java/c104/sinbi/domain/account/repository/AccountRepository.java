package c104.sinbi.domain.account.repository;

import c104.sinbi.domain.account.Account;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account as a WHERE a.id = :accountId")
    Optional<Account> findByAccountIdWithLock(@Param("accountId") Long accountId);

    @Modifying
    @Query("UPDATE Account a SET a.amount = a.amount - :amount WHERE a.id = :accountId AND a.amount >= :amount")
    int withdraw(@Param("accountId") Long accountId, @Param("amount") Long amount);
}
