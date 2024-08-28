package br.com.impacta.rango.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {
	
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, @Lazy FirebaseAuthenticationFilter firebaseAuthenticationFilter) throws Exception {
    	 http
         .csrf(csrf -> csrf.disable())
         .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
         .authorizeHttpRequests(authorize -> authorize
                 .requestMatchers(HttpMethod.POST, "/auth/sendEmailVerification").permitAll()
                 .requestMatchers(HttpMethod.POST, "/auth/verificateEmailCode").permitAll()
                 .anyRequest().authenticated()
         )
         .addFilterBefore(firebaseAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    	 return http.build();
    }

    @Bean
    public FirebaseAuthenticationFilter firebaseAuthenticationFilter() {
        return new FirebaseAuthenticationFilter();
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000","http://127.0.0.1:3000","http://192.168.56.1:3000","https://rango-food.netlify.app") // Adicione o URL do seu frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

