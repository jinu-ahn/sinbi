package c104.sinbi.domain.transactionhistory.repository;

import c104.sinbi.domain.transactionhistory.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
}
