package Gr5.Optical_Shop.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Vẫn disable CSRF cho API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")  // Endpoint xử lý login
                        .successHandler((req, res, auth) -> {
                            res.setContentType("application/json");
                            res.setStatus(200);
                            String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
                            res.getWriter().write("{\"message\":\"Đăng nhập thành công\", \"role\":\"" + role + "\"}");
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setContentType("application/json");
                            res.setStatus(401);
                            res.getWriter().write("{\"error\":\"Email/tên đăng nhập hoặc mật khẩu không đúng\"}");
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, auth) -> {
                            res.setContentType("application/json");
                            res.setStatus(200);
                            res.getWriter().write("{\"message\":\"Đăng xuất thành công\"}");
                        })
                        .permitAll()
                )
                .sessionManagement(session -> session
                        .maximumSessions(1)  // Chỉ cho 1 session hoạt động cùng lúc (tùy chọn)
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}