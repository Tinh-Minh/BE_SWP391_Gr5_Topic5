package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Account req) {
        Account acc = accountRepository.findByUsername(req.getUsername());

        if (acc == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User không tồn tại");
        }

        if (!acc.getPasswordHash().equals(req.getPasswordHash())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Sai mật khẩu");
        }

        return ResponseEntity.ok(acc);
    }
}
