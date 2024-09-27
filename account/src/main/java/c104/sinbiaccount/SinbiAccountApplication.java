package c104.sinbiaccount;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SinbiAccountApplication {

	public static void main(String[] args) {
		SpringApplication.run(SinbiAccountApplication.class, args);
	}

}
