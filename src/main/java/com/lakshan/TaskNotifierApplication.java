package com.lakshan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TaskNotifierApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskNotifierApplication.class, args);
	}

}
