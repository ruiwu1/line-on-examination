package com.iu.oleui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class OleUiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OleUiApplication.class, args);
	}

}
