package c104.sinbi.domain.transactionhistory.repository;

import c104.sinbi.domain.transactionhistory.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    List<TransactionHistory> findByAccountId(Long accountId);
}
