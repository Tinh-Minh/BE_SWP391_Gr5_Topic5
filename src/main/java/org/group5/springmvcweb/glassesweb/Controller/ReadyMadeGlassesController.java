package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.CreateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.DTO.ReadyMadeGlassesResponse;
import org.group5.springmvcweb.glassesweb.DTO.UpdateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;
import org.group5.springmvcweb.glassesweb.Service.ReadyMadeGlassesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/rmglasses")
public class ReadyMadeGlassesController {

    private final ReadyMadeGlassesService service;

    public  ReadyMadeGlassesController(ReadyMadeGlassesService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ReadyMadeGlassesResponse create
            (@Valid @RequestBody CreateReadyMadeGlassesRequest request){
        ReadyMadeGlasses entity = service.create(request);
        return ReadyMadeGlassesResponse.fromEntity(entity);
    }

    @GetMapping("/{id}")
    public ReadyMadeGlassesResponse getById
            (@PathVariable String id){
        return ReadyMadeGlassesResponse.fromEntity(service.getById(id));
    }

    @GetMapping("/all")
    public List<ReadyMadeGlassesResponse> getAll() {
        return service.getAll().stream()
                .map(ReadyMadeGlassesResponse::fromEntity)
                .toList();
    }

    @PutMapping("/update/{id}")
    public ReadyMadeGlassesResponse update(
            @PathVariable String id,
            @Valid @RequestBody UpdateReadyMadeGlassesRequest request){
        ReadyMadeGlasses entity = service.update(id, request);
        return ReadyMadeGlassesResponse.fromEntity(entity);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable String id){
        service.delete(id);
        return "success";
    }

}
