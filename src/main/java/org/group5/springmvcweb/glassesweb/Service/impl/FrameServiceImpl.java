package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateFrameRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.group5.springmvcweb.glassesweb.Service.FrameService;
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
                request.getName(),
                request.getPrice(),
                request.getStock(),
                request.getStatus(),
                request.getSize(),
                request.getRimType(),
                request.getFrameType()
        );
        Frame frame = Frame.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .material(request.getMaterial())
                .size(request.getSize())
                .rimType(request.getRimType())
                .frameType(request.getFrameType())
                .color(request.getColor())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .status((request.getStatus() == null || request.getStatus().trim().isEmpty())
                        ? "ACTIVE" : request.getStatus())
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
    public Frame updateFrame(Integer id, UpdateFrameRequest request) {
        Frame frame = frameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Frame không tồn tại"));

        if (request.getName() != null) {
            if (request.getName().trim().isEmpty()) {
                throw new RuntimeException("Tên gọng kính không được để trống");
            }
            frame.setName(request.getName());
        }

        if (request.getBrand() != null) {
            frame.setBrand(request.getBrand());
        }

        if (request.getMaterial() != null) {
            frame.setMaterial(request.getMaterial());
        }

        if (request.getSize() != null) {
            if (!request.getSize().equals("S")
                    && !request.getSize().equals("M")
                    && !request.getSize().equals("L")) {
                throw new RuntimeException("Kích thước chỉ được là S, M hoặc L");
            }
            frame.setSize(request.getSize());
        }

        if (request.getRimType() != null) {
            if (!request.getRimType().equals("FULL")
                    && !request.getRimType().equals("HALF")
                    && !request.getRimType().equals("RIMLESS")) {
                throw new RuntimeException("Kiểu gọng chỉ được là FULL, HALF hoặc RIMLESS");
            }
            frame.setRimType(request.getRimType());
        }

        if (request.getFrameType() != null) {
            if (!request.getFrameType().equals("EYEGLASSES")
                    && !request.getFrameType().equals("SUNGLASSES")) {
                throw new RuntimeException("Loại gọng chỉ được là EYEGLASSES hoặc SUNGLASSES");
            }
            frame.setFrameType(request.getFrameType());
        }

        if (request.getColor() != null) {
            frame.setColor(request.getColor());
        }

        if (request.getImageUrl() != null) {
            frame.setImageUrl(request.getImageUrl());
        }

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Giá phải lớn hơn hoặc bằng 0");
            }
            frame.setPrice(request.getPrice());
        }

        if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new RuntimeException("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
            }
            frame.setStock(request.getStock());
        }

        if (request.getStatus() != null) {
            if (!request.getStatus().equals("ACTIVE")
                    && !request.getStatus().equals("INACTIVE")) {
                throw new RuntimeException("Trạng thái chỉ được là ACTIVE hoặc INACTIVE");
            }
            frame.setStatus(request.getStatus());
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

    //Validate data to import
    private void validateFrameData(String name,
                                   BigDecimal price,
                                   Integer stock,
                                   String status,
                                   String size,
                                   String rimType,
                                   String frameType) {

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Tên gọng kính không được để trống");
        }

        if (price != null && price.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Giá phải lớn hơn hoặc bằng 0");
        }

        if (stock != null && stock < 0) {
            throw new RuntimeException("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
        }

        if (status != null
                && !status.equals("ACTIVE")
                && !status.equals("INACTIVE")) {
            throw new RuntimeException("Trạng thái chỉ được là ACTIVE hoặc INACTIVE");
        }

        if (size != null
                && !size.equals("S")
                && !size.equals("M")
                && !size.equals("L")) {
            throw new RuntimeException("Kích thước chỉ được là S, M hoặc L");
        }

        if (rimType != null
                && !rimType.equals("FULL")
                && !rimType.equals("HALF")
                && !rimType.equals("RIMLESS")) {
            throw new RuntimeException("Kiểu gọng chỉ được là FULL, HALF hoặc RIMLESS");
        }

        if (frameType != null
                && !frameType.equals("EYEGLASSES")
                && !frameType.equals("SUNGLASSES")) {
            throw new RuntimeException("Loại gọng chỉ được là EYEGLASSES hoặc SUNGLASSES");
        }
    }

    //Search/filter
    @Override
    public List<Frame> searchFrame (String name,
                                    String brand,
                                    String material,
                                    String size,
                                    String rimType,
                                    String frameType,
                                    String color,
                                    String status,
                                    BigDecimal minPrice,
                                    BigDecimal maxPrice){
        return frameRepository.findAll().stream()
                .filter(frame -> name == null
                        || (frame.getName() != null
                        && frame.getName().toLowerCase().contains(name.toLowerCase())))
                .filter(frame -> brand == null
                        || (frame.getBrand() != null
                        && frame.getBrand().toLowerCase().contains(brand.toLowerCase())))
                .filter(frame -> material == null
                        || (frame.getMaterial() != null
                        && frame.getMaterial().toLowerCase().contains(material.toLowerCase())))
                .filter(frame -> size == null
                        || (frame.getSize() != null
                        && frame.getSize().equalsIgnoreCase(size)))
                .filter(frame -> rimType == null
                        || (frame.getRimType() != null
                        && frame.getRimType().equalsIgnoreCase(rimType)))
                .filter(frame -> frameType == null
                        || (frame.getFrameType() != null
                        && frame.getFrameType().equalsIgnoreCase(frameType)))
                .filter(frame -> color == null
                        || (frame.getColor() != null
                        && frame.getColor().toLowerCase().contains(color.toLowerCase())))
                .filter(frame -> status == null
                        || (frame.getStatus() != null
                        && frame.getStatus().equalsIgnoreCase(status)))
                .filter(frame -> minPrice == null
                        || (frame.getPrice() != null
                        && frame.getPrice().compareTo(minPrice) >= 0))
                .filter(frame -> maxPrice == null
                        || (frame.getPrice() != null
                        && frame.getPrice().compareTo(maxPrice) <= 0))
                .toList();
    }
}