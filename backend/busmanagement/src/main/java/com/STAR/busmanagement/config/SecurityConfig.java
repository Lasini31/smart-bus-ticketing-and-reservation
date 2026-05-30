package com.STAR.busmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {
    //For mock testing
    
    

    @Value("${app.auth.mock:false}") // default false if not set
    private boolean mock;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable());


            // Supabse DB
            // .authorizeHttpRequests(auth -> auth

            //     // Auth endpoints allowed
            //     .requestMatchers("/auth/**").permitAll()

            //     // Everything else requires authentication
            //     .anyRequest().authenticated()
            // )

            // .oauth2ResourceServer(oauth -> oauth
            //     .jwt(jwt -> jwt.jwtAuthenticationConverter(new JwtAuthConverter()))
            // );

            
            //For mock DB
            if (mock) {
                http.authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
                );
            } else {
                http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(new JwtAuthConverter()))
                );
    }

        return http.build();
    }
}