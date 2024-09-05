package c104.sinbi.domain.virtualaccount.repository;

import c104.sinbi.domain.virtualaccount.VirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
}
