package c104.sinbi.domain.user.repository;

import c104.sinbi.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserPhone(String phoneNum);
}
