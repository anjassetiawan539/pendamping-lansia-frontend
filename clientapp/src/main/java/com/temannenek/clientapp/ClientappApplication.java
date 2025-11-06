package com.temannenek.clientapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClientappApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientappApplication.class, args);

		System.out.println("Client Application is running in port 9001");
	}

}
