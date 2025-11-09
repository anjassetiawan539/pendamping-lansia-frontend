package com.temanlansiabe.temanlansia_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TemanlansiaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TemanlansiaBackendApplication.class, args);

		System.out.println("\nServerApp is running on port 9000\n");
	}
}
