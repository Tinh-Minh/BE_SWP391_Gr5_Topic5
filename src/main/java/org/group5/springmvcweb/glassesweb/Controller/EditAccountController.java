package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.EditAccountRequest;
import org.group5.springmvcweb.glassesweb.DTO.LoginRequest;
import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Repository.EditAccountRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/account")
public class EditAccountController {

    @Autowired
    private EditAccountRepository editAccountRepository;

    @PutMapping("/edit")
    public ResponseEntity<?> editAccount(@Valid @RequestBody EditAccountRequest request) {

        Account acc = editAccountRepository.findByUsername(request.getOldUsername());
        if (acc == null) {
            return ResponseEntity.status(404).body("Không tìm thấy tài khoản");
        }

        if (!acc.getPasswordHash().equals(request.getOldPassword())) {
            return ResponseEntity.status(401).body("Sai mật khẩu cũ");
        }

        if (request.getNewUsername() != null) {
            acc.setUsername(request.getNewUsername());
        }

        if (request.getNewPassword() != null) {
            acc.setPasswordHash(request.getNewPassword());
        }

        editAccountRepository.save(acc);

        return ResponseEntity.ok("Cập nhật tài khoản thành công");
    }
}

