package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.FrameResponse;
import org.group5.springmvcweb.glassesweb.DTO.UpdateFrameRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrameService {
    @Autowired
    private FrameRepository frameRepository;

    //Create
    public Frame createFrame(CreateFrameRequest request){
        Frame frame = Frame.builder()
                .brand(request.getBrand())
                .material(request.getMaterial())
                .size(request.getSize())
                .rimType(request.getRimType())
                .price(request.getPrice())
                .build();
        return frameRepository.save(frame);

    }
    //Read
    public Frame getFrameById(Integer id){
        return frameRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Frame không tồn tại")
        );
    }

    public List<Frame> getAllFrames(){
        return frameRepository.findAll();
    }

    //Update
    public Frame updateFrame(Integer id, UpdateFrameRequest request){
        //Tìm frame DB
        Frame frame = frameRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Frame Not Found"));

        //Set dữ liệu mới
        frame.setBrand(request.getBrand());
        frame.setMaterial(request.getMaterial());
        frame.setSize(request.getSize());
        frame.setRimType(request.getRimType());
        frame.setPrice(request.getPrice());

        return frameRepository.save(frame);

    }

    //Delete
    public void deleteFrame(Integer id){
        frameRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Frame Not Found"));
        frameRepository.deleteById(id);
    }
}

