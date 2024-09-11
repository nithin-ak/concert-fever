package com.concertfever.concertfever_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for setting up CORS (Cross-Origin Resource Sharing) in the application.
 * This configuration allows cross-origin requests to the backend server from any origin.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures the CORS mappings to allow cross-origin requests.
     *
     * @param registry The {@link CorsRegistry} used to configure CORS mappings.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173/") // Only allows frontend. Change to * to allow request from any origin
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allows the specified HTTP methods.
                .allowedHeaders("*"); // Allows all headers in requests.
    }
}
