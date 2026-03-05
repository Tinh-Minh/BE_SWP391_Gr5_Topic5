package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.FrameResponse;
import org.group5.springmvcweb.glassesweb.DTO.UpdateFrameRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Service.FrameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/frames")
public class FrameController {
    @Autowired
    private FrameService frameService;

    @PostMapping("/createframes")
    public FrameResponse createFrame(
            @Valid @RequestBody CreateFrameRequest request){
        Frame frame = frameService.createFrame(request);
        return FrameResponse.fromEntity(frame);
    }

    @GetMapping("/{id}")
    public FrameResponse getFrameById(@PathVariable Integer id){
        Frame frame = frameService.getFrameById(id);
        return FrameResponse.fromEntity(frame);
    }

    @GetMapping("/Allframes")
    public List<FrameResponse> getAllFrames(){
        List<Frame> frames = frameService.getAllFrames();

        return frames.stream().map(FrameResponse::fromEntity).toList();
    }

    @PutMapping("/update/{id}")
    public FrameResponse updateFrame(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateFrameRequest request){
        Frame frame = frameService.updateFrame(id, request);
        return FrameResponse.fromEntity(frame);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFrame(@PathVariable Integer id){
        frameService.deleteFrame(id);
        return "success";
    }

}
