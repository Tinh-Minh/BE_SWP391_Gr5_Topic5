package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.LoginRequest;
import org.group5.springmvcweb.glassesweb.DTO.LoginResponse;
import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Account account = accountRepository.findByUsername(request.getIdentifier());
        if (account == null) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }
        if (!account.getPasswordHash().equals(request.getPassword())) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        account.getUsername(),
                        account.getRole()
                )
        );
    }
}
