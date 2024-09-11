package com.concertfever.concertfever_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Security configuration class for setting up Spring Security.
 * <p>
 * This class configures the security settings for the application, including
 * HTTP request authorization and password encoding.
 * </p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security filter chain for HTTP requests.
     * <p>
     * This method sets up the security filter chain to permit all requests
     * without authentication and disables CSRF (Cross-Site Request Forgery)
     * protection for all endpoints. Basic HTTP authentication is enabled.
     * </p>
     *
     * @param http the {@link HttpSecurity} object used to configure HTTP security
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Allow all requests without authentication
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // Enable basic HTTP authentication
                .httpBasic(withDefaults())
                // Disable CSRF protection for all endpoints
                .csrf(c -> c.ignoringRequestMatchers("/**").disable());
        return http.build();
    }

    /**
     * Provides a BCryptPasswordEncoder bean for encoding passwords.
     * <p>
     * This method returns an instance of {@link BCryptPasswordEncoder} which
     * is used for hashing and verifying passwords securely.
     * </p>
     *
     * @return a {@link BCryptPasswordEncoder} instance
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
