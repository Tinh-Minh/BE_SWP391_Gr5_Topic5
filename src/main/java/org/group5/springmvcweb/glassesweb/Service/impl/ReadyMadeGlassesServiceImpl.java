package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.group5.springmvcweb.glassesweb.Repository.LensRepository;
import org.group5.springmvcweb.glassesweb.Repository.ReadyMadeGlassesRepository;
import org.group5.springmvcweb.glassesweb.Service.ReadyMadeGlassesService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class ReadyMadeGlassesServiceImpl implements ReadyMadeGlassesService {

    private final ReadyMadeGlassesRepository readyMadeGlassesRepository;
    private final FrameRepository frameRepository;
    private final LensRepository lensRepository;

    public ReadyMadeGlassesServiceImpl(ReadyMadeGlassesRepository readyMadeGlassesRepository,
                                       FrameRepository frameRepository, LensRepository lensRepository) {
        this.readyMadeGlassesRepository = readyMadeGlassesRepository;
        this.frameRepository = frameRepository;
        this.lensRepository = lensRepository;
    }

    @Override
    public ReadyMadeGlasses create(CreateReadyMadeGlassesRequest request) {
            Frame frame = frameRepository.findById(request.getFrameId())
                    .orElseThrow(() -> new RuntimeException("Frame not found with id " + request.getFrameId()));
            Lens lens = lensRepository.findById(request.getLensId())
                    .orElseThrow(() -> new RuntimeException("Lens not found with id " + request.getLensId()));
            ValidateReadyMadeGlassesData(
                    request.getFixedPrescription(),
                    request.getPrice(),
                    lens
            );
            ReadyMadeGlasses readyMadeGlasses = ReadyMadeGlasses.builder()
                    .readyGlassesId(generateReadyMadeGlassesId())
                    .frameId(frame.getFrameId())
                    .lensId(lens.getLensId())
                    .fixedPrescription(request.getFixedPrescription())
                    .price(request.getPrice())
                    .build();
            return  readyMadeGlassesRepository.save(readyMadeGlasses);
    }

    @Override
    public ReadyMadeGlasses getById(String id) {
        return readyMadeGlassesRepository.findById(id).orElseThrow(() ->
                new RuntimeException("ReadyMadeGlasses not found with id " + id));
    }

    @Override
    public List<ReadyMadeGlasses> getAll() {
        return readyMadeGlassesRepository.findAll();
    }

    @Override
    public ReadyMadeGlasses update(String id, UpdateReadyMadeGlassesRequest request) {
        ReadyMadeGlasses entity = readyMadeGlassesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ready-made glasses not found with id " + id));

        Integer newFrameId = request.getFrameId() != null ? request.getFrameId() : entity.getFrameId();
        Integer newLensId = request.getLensId() != null ? request.getLensId() : entity.getLensId();
        String newFixedPrescription = request.getFixedPrescription() != null
                ? request.getFixedPrescription()
                : entity.getFixedPrescription();
        BigDecimal newPrice = request.getPrice() != null ? request.getPrice() : entity.getPrice();

        Frame frame = frameRepository.findById(newFrameId)
                .orElseThrow(() -> new RuntimeException("Frame not found with id " + newFrameId));

        Lens lens = lensRepository.findById(newLensId)
                .orElseThrow(() -> new RuntimeException("Lens not found with id " + newLensId));

        ValidateReadyMadeGlassesData(newFixedPrescription, newPrice, lens);

        if (request.getFrameId() != null) {
            entity.setFrameId(frame.getFrameId());
        }

        if (request.getLensId() != null) {
            entity.setLensId(lens.getLensId());
        }

        if (request.getFixedPrescription() != null) {
            entity.setFixedPrescription(request.getFixedPrescription().trim());
        }

        if (request.getPrice() != null) {
            entity.setPrice(request.getPrice());
        }

        return readyMadeGlassesRepository.save(entity);
    }

    @Override
    public void delete(String id) {
        if (!readyMadeGlassesRepository.existsById(id)) {
            throw new RuntimeException("ReadyMadeGlasses not found with id " + id);
        }
        readyMadeGlassesRepository.deleteById(id);
    }

    private void ValidateReadyMadeGlassesData(String fixedPrescription, BigDecimal price, Lens lens) {
        if(fixedPrescription == null || fixedPrescription.trim().isEmpty()){
            throw new RuntimeException("Fixed prescription must not be blank");
        }
        if(price == null || price.compareTo(BigDecimal.ZERO) <= 0){
            throw new RuntimeException("Price must be greater than zero");
        }
        if(lens.getLensType() != null && lens.getLensType().trim().equalsIgnoreCase("contact lens")){
            throw new RuntimeException("Contact lens cannot be used for ready-made glasses");
        }
    }

    private String generateReadyMadeGlassesId() {
        return "RMG-"+UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
