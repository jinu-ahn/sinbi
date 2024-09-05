package c104.sinbi.domain.account.repository;

import c104.sinbi.domain.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
