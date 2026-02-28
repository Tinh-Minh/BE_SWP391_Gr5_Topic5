package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.UpdateRoleRequest;
import org.group5.springmvcweb.glassesweb.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AuthService authService;

    @PutMapping("/accounts/{id}/role")
    public ResponseEntity<Map<String, String>> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateRoleRequest request) {
        authService.updateRole(id, request.getRole());
        return ResponseEntity.ok(Map.of("message", "Role update successful!"));
    }
}