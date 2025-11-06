package com.temanlansiabe.temanlansia_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TemanlansiaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TemanlansiaBackendApplication.class, args);

		System.out.println("\nServerApp is running on port 9000\n");
	}
}
