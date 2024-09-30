package c104.sinbicommon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SinbiCommonApplication {

    public static void main(String[] args) {
        SpringApplication.run(SinbiCommonApplication.class, args);
    }

}
