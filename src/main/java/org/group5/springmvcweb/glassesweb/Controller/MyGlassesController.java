// File: MyGlassesController.java (update getCurrentCustomerId if auth enabled)
package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.Entity.MyGlasses;
import org.group5.springmvcweb.glassesweb.Service.MyGlassesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my-glasses")
public class MyGlassesController {

    @Autowired
    private MyGlassesService service;

    @PostMapping("/create")
    public ResponseEntity<MyGlasses> createFromDesign(@RequestParam Integer designId) {
        MyGlasses created = service.createFromDesign(designId);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/list")
    public ResponseEntity<List<MyGlasses>> getMyGlasses(@RequestParam Integer customerId) { // Add param for now
        return ResponseEntity.ok(service.getMyGlasses(customerId));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<MyGlasses> getDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getMyGlassesDetail(id));
    }
}