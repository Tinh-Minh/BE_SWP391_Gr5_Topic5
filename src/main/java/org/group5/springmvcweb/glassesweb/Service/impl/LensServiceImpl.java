package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateLensRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensRequest;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Repository.LensRepository;
import org.group5.springmvcweb.glassesweb.Service.LensService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LensServiceImpl implements LensService {

    private final LensRepository lensRepository;

    public LensServiceImpl(LensRepository lensRepository) {
        this.lensRepository = lensRepository;
    }

    // Create
    @Override
    public Lens createLens(CreateLensRequest request) {
        validateLensData(
                request.getName(),
                request.getLensType(),
                request.getColorChange(),
                request.getLensSize(),
                request.getMinSph(),
                request.getMaxSph(),
                request.getBasePrice(),
                request.getStock(),
                request.getStatus()
        );

        Lens lens = Lens.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .lensType(request.getLensType())
                .colorChange(request.getColorChange())
                .lensSize(request.getLensSize())
                .minSph(request.getMinSph())
                .maxSph(request.getMaxSph())
                .imageUrl(request.getImageUrl())
                .basePrice(request.getBasePrice())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .status((request.getStatus() == null || request.getStatus().trim().isEmpty())
                        ? "ACTIVE" : request.getStatus())
                .build();

        return lensRepository.save(lens);
    }

    // Read by id
    @Override
    public Lens getLensById(Integer id) {
        return lensRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tròng kính"));
    }

    // Read all
    @Override
    public List<Lens> getAllLens() {
        return lensRepository.findAll();
    }

    // Update
    @Override
    public Lens updateLens(Integer id, UpdateLensRequest request) {
        Lens lens = lensRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tròng kính"));

        if (request.getName() != null) {
            if (request.getName().trim().isEmpty()) {
                throw new RuntimeException("Tên tròng kính không được để trống");
            }
            lens.setName(request.getName());
        }

        if (request.getBrand() != null) {
            lens.setBrand(request.getBrand());
        }

        if (request.getLensType() != null) {
            if (!request.getLensType().equals("SINGLE_VISION")
                    && !request.getLensType().equals("PROGRESSIVE")
                    && !request.getLensType().equals("BIFOCAL")
                    && !request.getLensType().equals("SUNGLASSES")) {
                throw new RuntimeException("Loại tròng chỉ được là SINGLE_VISION, PROGRESSIVE, BIFOCAL hoặc SUNGLASSES");
            }
            lens.setLensType(request.getLensType());
        }

        if (request.getColorChange() != null) {
            lens.setColorChange(request.getColorChange());
        }

        if (request.getLensSize() != null) {
            if (!request.getLensSize().equals("S")
                    && !request.getLensSize().equals("M")
                    && !request.getLensSize().equals("L")) {
                throw new RuntimeException("Kích thước tròng chỉ được là S, M hoặc L");
            }
            lens.setLensSize(request.getLensSize());
        }

        BigDecimal newMinSph = request.getMinSph() != null ? request.getMinSph() : lens.getMinSph();
        BigDecimal newMaxSph = request.getMaxSph() != null ? request.getMaxSph() : lens.getMaxSph();

        if (newMinSph != null && newMaxSph != null && newMinSph.compareTo(newMaxSph) > 0) {
            throw new RuntimeException("minSph phải nhỏ hơn hoặc bằng maxSph");
        }

        if (request.getMinSph() != null) {
            lens.setMinSph(request.getMinSph());
        }
        if (request.getMaxSph() != null) {
            lens.setMaxSph(request.getMaxSph());
        }

        if (request.getImageUrl() != null) {
            lens.setImageUrl(request.getImageUrl());
        }

        if (request.getBasePrice() != null) {
            if (request.getBasePrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Giá cơ bản phải lớn hơn hoặc bằng 0");
            }
            lens.setBasePrice(request.getBasePrice());
        }

        if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new RuntimeException("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
            }
            lens.setStock(request.getStock());
        }

        if (request.getStatus() != null) {
            if (!request.getStatus().equals("ACTIVE")
                    && !request.getStatus().equals("INACTIVE")) {
                throw new RuntimeException("Trạng thái chỉ được là ACTIVE hoặc INACTIVE");
            }
            lens.setStatus(request.getStatus());
        }

        return lensRepository.save(lens);
    }

    // Delete
    @Override
    public void deleteLens(Integer id) {
        if (!lensRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tròng kính");
        }
        lensRepository.deleteById(id);
    }

    // Validate create
    private void validateLensData(String name,
                                  String lensType,
                                  Boolean colorChange,
                                  String lensSize,
                                  BigDecimal minSph,
                                  BigDecimal maxSph,
                                  BigDecimal basePrice,
                                  Integer stock,
                                  String status) {

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Tên tròng kính không được để trống");
        }

        if (lensType != null
                && !lensType.equals("SINGLE_VISION")
                && !lensType.equals("PROGRESSIVE")
                && !lensType.equals("BIFOCAL")
                && !lensType.equals("SUNGLASSES")) {
            throw new RuntimeException("Loại tròng chỉ được là SINGLE_VISION, PROGRESSIVE, BIFOCAL hoặc SUNGLASSES");
        }

        if (lensSize != null
                && !lensSize.equals("S")
                && !lensSize.equals("M")
                && !lensSize.equals("L")) {
            throw new RuntimeException("Kích thước tròng chỉ được là S, M hoặc L");
        }

        if (minSph != null && maxSph != null && minSph.compareTo(maxSph) > 0) {
            throw new RuntimeException("minSph phải nhỏ hơn hoặc bằng maxSph");
        }

        if (basePrice != null && basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Giá cơ bản phải lớn hơn hoặc bằng 0");
        }

        if (stock != null && stock < 0) {
            throw new RuntimeException("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
        }

        if (status != null
                && !status.equals("ACTIVE")
                && !status.equals("INACTIVE")) {
            throw new RuntimeException("Trạng thái chỉ được là ACTIVE hoặc INACTIVE");
        }
    }

    // Search / Filter
    @Override
    public List<Lens> searchLens(String name,
                                 String brand,
                                 String lensType,
                                 Boolean colorChange,
                                 String lensSize,
                                 BigDecimal targetSph,
                                 String status,
                                 BigDecimal minPrice,
                                 BigDecimal maxPrice) {
        return lensRepository.findAll().stream()
                .filter(lens -> name == null
                        || (lens.getName() != null
                        && lens.getName().toLowerCase().contains(name.toLowerCase())))
                .filter(lens -> brand == null
                        || (lens.getBrand() != null
                        && lens.getBrand().toLowerCase().contains(brand.toLowerCase())))
                .filter(lens -> lensType == null
                        || (lens.getLensType() != null
                        && lens.getLensType().equalsIgnoreCase(lensType)))
                .filter(lens -> colorChange == null
                        || (lens.getColorChange() != null
                        && lens.getColorChange().equals(colorChange)))
                .filter(lens -> lensSize == null
                        || (lens.getLensSize() != null
                        && lens.getLensSize().equalsIgnoreCase(lensSize)))
                .filter(lens -> targetSph == null
                        || (lens.getMinSph() != null
                        && lens.getMaxSph() != null
                        && targetSph.compareTo(lens.getMinSph()) >= 0
                        && targetSph.compareTo(lens.getMaxSph()) <= 0))
                .filter(lens -> status == null
                        || (lens.getStatus() != null
                        && lens.getStatus().equalsIgnoreCase(status)))
                .filter(lens -> minPrice == null
                        || (lens.getBasePrice() != null
                        && lens.getBasePrice().compareTo(minPrice) >= 0))
                .filter(lens -> maxPrice == null
                        || (lens.getBasePrice() != null
                        && lens.getBasePrice().compareTo(maxPrice) <= 0))
                .toList();
    }
}