package c104.sinbi.domain.user.service;

import c104.sinbi.common.exception.UserAlreadyExistsException;
import c104.sinbi.domain.user.User;
import c104.sinbi.domain.user.UserAdapter;
import c104.sinbi.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/08
 * 설명 : UserDetailsService 구현체
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    /**
     * @ 작성자   : 안진우
     * @ 작성일   : 2024-09-08
     * @ 설명     : SecurityContextHolder에 저장할 유저 디테일 생성
     * @param phone 유저 휴대전화 번호
     * @return 유저 객체를 담고있는 Adapter
     */
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        User user = userRepository.findByUserPhone(phone).orElseThrow(() ->
                new UserAlreadyExistsException());
        return new UserAdapter(user);
    }
}
