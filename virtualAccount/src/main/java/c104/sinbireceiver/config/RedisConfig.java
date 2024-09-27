package c104.sinbireceiver.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
@EnableRedisRepositories // Redis 레포지토리 기능 활성화
public class RedisConfig {
    @Value("${spring.redis.virtual-account.host}")
    private String host;
    @Value("${spring.redis.virtual-account.port}")
    private int port;
    @Value("${spring.redis.virtual-account.password}")
    private String password;

    @Bean // 스프링 컨텍스트에 RedisConnectionFactory 빈 등록
    public RedisConnectionFactory redisConnectionFactory(){
        // LettuceConnectionFactory를 사용하여 Redis 연결 팩토리 생성, 호스트와 포트 정보를 사용
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(host,port);
        redisStandaloneConfiguration.setPassword(password);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>(); // RedisTemplate 인스턴스 생성
        redisTemplate.setConnectionFactory(redisConnectionFactory()); // Redis 연결 팩토리 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer()); // 키를 문자열로 직렬화하도록 설정
        redisTemplate.setValueSerializer(new StringRedisSerializer()); // 값을 문자열로 직렬화하도록 설정

        return redisTemplate; // 설정이 완료된 RedisTemplate 인스턴스를 반환
    }
}
