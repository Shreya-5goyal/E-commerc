package gusto.gusto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class})
public class GustoApplication {

	public static void main(String[] args) {
		SpringApplication.run(GustoApplication.class, args);
	}

}
