package org.group5.springmvcweb.glassesweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GlassesWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(GlassesWebApplication.class, args);
    }

}