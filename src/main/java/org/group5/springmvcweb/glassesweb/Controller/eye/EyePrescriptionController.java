package org.group5.springmvcweb.glassesweb.Controller.eye;

import org.group5.springmvcweb.glassesweb.Entity.eye.EyePrescription;
import org.group5.springmvcweb.glassesweb.Entity.eye.PrescriptionFile;
import org.group5.springmvcweb.glassesweb.Service.eye.EyePrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eye-prescriptions")
public class EyePrescriptionController {

    @Autowired
    private EyePrescriptionService service;

    private Integer getCurrentCustomerId() {
        // TODO: Sau khi bật auth thật, uncomment phần này
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // if (auth == null || !auth.isAuthenticated()) {
        //     throw new RuntimeException("Chưa đăng nhập");
        // }
        // String username = auth.getName();
        // // Lấy customerId từ AccountRepository dựa trên username
        // // return accountRepository.findByUsername(username).get().getCustomerId();

        return 1;  // Hardcode tạm để test, thay bằng logic auth khi deploy
    }

    @PostMapping
    public ResponseEntity<EyePrescription> create(
            @RequestBody EyePrescription prescription,
            @RequestParam Integer eyeProfileId) {
        Integer customerId = getCurrentCustomerId();
        EyePrescription created = service.createEyePrescription(prescription, eyeProfileId, customerId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EyePrescription> update(
            @PathVariable Integer id,
            @RequestBody EyePrescription updated) {
        Integer customerId = getCurrentCustomerId();
        EyePrescription updatedPres = service.updatePrescription(id, updated, customerId);
        return ResponseEntity.ok(updatedPres);
    }

    @GetMapping
    public ResponseEntity<List<EyePrescription>> getAllByProfile(@RequestParam Integer eyeProfileId) {
        Integer customerId = getCurrentCustomerId();
        return ResponseEntity.ok(service.getAllByEyeProfile(eyeProfileId, customerId));
    }

    @PostMapping("/upload-file")
    public ResponseEntity<PrescriptionFile> uploadFile(
            @RequestParam String fileUrl,
            @RequestParam Integer eyeProfileId) {
        Integer customerId = getCurrentCustomerId();
        PrescriptionFile uploaded = service.uploadPrescriptionFile(fileUrl, eyeProfileId, customerId);
        return ResponseEntity.ok(uploaded);
    }
}