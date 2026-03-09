package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateFrameRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.group5.springmvcweb.glassesweb.Service.FrameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FrameServiceImpl implements FrameService {

    private final FrameRepository frameRepository;

    public FrameServiceImpl(FrameRepository frameRepository) {
        this.frameRepository = frameRepository;
    }

    //Create
    @Override
    public Frame createFrame(CreateFrameRequest request){
        validateFrameData(
                request.getBrand(),
                request.getMaterial(),
                request.getSize(),
                request.getRimType(),
                request.getPrice()
        );
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
    @Override
    public Frame getFrameById(Integer id){
        return frameRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Frame không tồn tại")
        );
    }

    public List<Frame> getAllFrames(){
        return frameRepository.findAll();
    }

    //Update
    @Override
        public Frame updateFrame(Integer id, UpdateFrameRequest request){
        //Tìm frame DB
        Frame frame = frameRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Frame Not Found"));

        //Set dữ liệu mới
        if(request.getSize() != null){
            if(request.getBrand().trim().isEmpty()){
                throw new RuntimeException("Brand must not be blank");
            }
            frame.setBrand(request.getBrand());
        }
        if(request.getMaterial() != null){
            if(request.getMaterial().trim().isEmpty()){
                throw new RuntimeException("Material must not be blank");
            }
            frame.setMaterial(request.getMaterial());
        }
        if(request.getSize() != null){
            if(request.getSize().trim().isEmpty()){
                throw new RuntimeException("Size must not be blank");
            }
            frame.setSize(request.getSize());
        }
        if(request.getRimType() != null){
            if(request.getRimType().trim().isEmpty()){
                throw new RuntimeException("RimType must not be blank");
            }
            frame.setRimType(request.getRimType());
        }
        if(request.getPrice() != null){
            if(request.getPrice().compareTo(new BigDecimal(0)) <= 0){
                throw new RuntimeException("Price must be greater than 0");
            }
            frame.setPrice(request.getPrice());
        }
        return frameRepository.save(frame);

    }

    //Delete
    @Override
    public void deleteFrame(Integer id){
        if(!frameRepository.existsById(id)){
            throw new RuntimeException("Frame Not Found");
        }
        frameRepository.deleteById(id);
    }

    private void validateFrameData(String brand, String material,
                                   String size, String rimType, BigDecimal price){
        if(brand == null || brand.trim().isEmpty()){
            throw new RuntimeException("Brand must not be blank");
        }
        if(material == null || material.trim().isEmpty()){
            throw new RuntimeException("Material must not be blank");
        }
        if(size == null || size.trim().isEmpty()){
            throw new RuntimeException("Size must not be blank");
        }
        if(rimType == null || rimType.trim().isEmpty()){
            throw new RuntimeException("RimType must not be blank");
        }
        if(price == null || price.compareTo(new BigDecimal(0)) <= 0){
            throw new RuntimeException("Price must be greater than 0");
        }
    }
}
