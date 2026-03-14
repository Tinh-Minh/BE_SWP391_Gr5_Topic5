package org.group5.springmvcweb.glassesweb.Controller.design;

import org.group5.springmvcweb.glassesweb.Entity.design.GlassesDesign;
import org.group5.springmvcweb.glassesweb.Entity.design.DesignFrame;
import org.group5.springmvcweb.glassesweb.Entity.design.DesignLens;
import org.group5.springmvcweb.glassesweb.Service.design.GlassesDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/glasses-designs")
public class GlassesDesignController {

    @Autowired
    private GlassesDesignService service;

    private Integer getCurrentCustomerId() {
        return 1;  // Hardcode tạm, sau này thay bằng auth logic giống các controller khác
    }

    @PostMapping("/create")
    public ResponseEntity<GlassesDesign> create(@RequestParam Integer eyeProfileId) {
        GlassesDesign created = service.createGlassesDesign(eyeProfileId);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/frame/{id}")
    public ResponseEntity<DesignFrame> addFrame(@PathVariable Integer id, @RequestParam Integer frameId) {
        DesignFrame added = service.addFrame(id, frameId);
        return ResponseEntity.ok(added);
    }

    @PostMapping("/lens/{id}")
    public ResponseEntity<DesignLens> addLens(
            @PathVariable Integer id,
            @RequestParam String eyeSide,
            @RequestParam Integer lensId,
            @RequestParam(required = false) Integer lensOptionId) {
        DesignLens added = service.addLens(id, eyeSide, lensId, lensOptionId);
        return ResponseEntity.ok(added);
    }

    /**
     * Thêm LensOption vào một DesignLens cụ thể.
     * {id} ở đây là designLensId (id của bản ghi DesignLens), không phải designId.
     * Ví dụ: POST /api/glasses-designs/lens-option/3?lensOptionId=2
     */
    @PostMapping("/lens-option/{designLensId}")
    public ResponseEntity<DesignLens> addLensOption(
            @PathVariable Integer designLensId,
            @RequestParam Integer lensOptionId) {
        DesignLens updated = service.addLensOption(designLensId, lensOptionId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/price")
    public ResponseEntity<Double> getTotalPrice(@PathVariable Integer id) {
        double price = service.calculateTotalPrice(id);
        return ResponseEntity.ok(price);
    }

    @GetMapping("/{id}/validate")
    public ResponseEntity<String> validateCompatibility(@PathVariable Integer id) {
        boolean valid = service.validateDesign(id);
        return ResponseEntity.ok(valid ? "Tương thích OK" : "Không tương thích (độ kính / lens / frame)");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<GlassesDesign> updateDesign(@PathVariable Integer id, @RequestBody GlassesDesign updated) {
        GlassesDesign design = service.updateDesign(id, updated);
        return ResponseEntity.ok(design);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteDesign(@PathVariable Integer id) {
        service.deleteDesign(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa thiết kế thành công");
        return ResponseEntity.ok(response);
    }
}