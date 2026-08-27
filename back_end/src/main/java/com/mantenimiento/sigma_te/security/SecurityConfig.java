package com.mantenimiento.sigma_te.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                // TEMPORAL: abierto para pruebas, pendiente configurar JWT completo
                .requestMatchers("/api/roles/**").permitAll()
                .requestMatchers("/api/permisos/**").permitAll()
                .requestMatchers("/api/estados-equipo/**").permitAll()
                .requestMatchers("/api/tipo-notificacion/**").permitAll()
                .requestMatchers("/api/usuarios/**").permitAll()
                .requestMatchers("/api/equipos/**").permitAll()
                .requestMatchers("/api/fallas/**").permitAll()
                .requestMatchers("/api/mantenimientos/**").permitAll()
                .requestMatchers("/api/evidencias/**").permitAll()
                .requestMatchers("/api/notificaciones/**").permitAll()
                .requestMatchers("/api/auditorias/**").permitAll()
                .requestMatchers("/api/rol-permisos/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
