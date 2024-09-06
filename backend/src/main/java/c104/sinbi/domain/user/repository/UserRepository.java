package c104.sinbi.domain.user.repository;

import c104.sinbi.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserPhone(String userPhone);
}
