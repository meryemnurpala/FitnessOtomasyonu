package com.fitness.fitnessapp.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Tüm API'lere CORS izni verme
        registry.addMapping("/api/**") // Hangi path'ler için CORS açılacağı
                .allowedOrigins("http://localhost:3000") // Hangi origin'lere izin verileceği
                .allowedMethods("GET", "POST", "PUT", "DELETE") // İzin verilen HTTP metodları
                .allowedHeaders("*") // Tüm header'lara izin verilecek
                .allowCredentials(true); // Çerez paylaşımına izin verilecek
    }
}
