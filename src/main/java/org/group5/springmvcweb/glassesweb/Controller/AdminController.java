package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.UpdateProfileRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateRoleRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateStatusRequest;
import org.group5.springmvcweb.glassesweb.Service.AuthService;
import org.group5.springmvcweb.glassesweb.Service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AuthService authService;
    @Autowired
    private CustomerService customerService;

    //admin update role cho bất kỳ ai
    @PutMapping("/accounts/{id}/role")
    public ResponseEntity<Map<String, String>> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateRoleRequest request) {
        authService.updateRole(id, request.getRole());
        return ResponseEntity.ok(Map.of("message", "Role update successful!"));
    }
    // Admin update profile cho bất kỳ ai
    @PutMapping("/customers/{id}/profile")
    public ResponseEntity<Map<String, String>> adminUpdateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileRequest request) {

        customerService.adminUpdateProfile(id, request);
        return ResponseEntity.ok(Map.of("message", "Profile update successful!"));
    }
    // Block/Activate user
    @PutMapping("/customers/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateStatusRequest request) {

        customerService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(Map.of("message", "Status update successful!"));
    }
}