package org.group5.springmvcweb.glassesweb.Controller;


import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.CreateLensRequest;
import org.group5.springmvcweb.glassesweb.DTO.FrameResponse;
import org.group5.springmvcweb.glassesweb.DTO.LensResponse;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Service.LensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/lens")
public class LensController {
    @Autowired
    private LensService lensService;

    @PostMapping("/createlens")
    public LensResponse createLens(
            @Valid @RequestBody CreateLensRequest request){

        Lens lens = lensService.createLens(request);
        return LensResponse.fromEntity(lens);
    }

    @GetMapping("/{id}")
    public LensResponse getLensById(@PathVariable Integer id){
        Lens lens = lensService.getLensById(id);
        return LensResponse.fromEntity(lens);
    }

    @GetMapping("/Alllens")
    public List<LensResponse> getAllLens(){
        List<Lens> lens = lensService.getAllLens();
        return lens.stream().map(LensResponse::fromEntity).toList();
    }

    @PutMapping("/update/{id}")
    public LensResponse updateLens(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateLensRequest request){

        Lens lens = lensService.updateLens(id, request);
        return LensResponse.fromEntity(lens);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteLens(@PathVariable Integer id){
        lensService.deleteLens(id);
        return "success";
    }
}
