package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateLensOptionRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensOptionRequest;
import org.group5.springmvcweb.glassesweb.Entity.LensOption;
import org.group5.springmvcweb.glassesweb.Repository.LensOptionRepository;
import org.group5.springmvcweb.glassesweb.Service.LensOptionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LensOptionServiceImpl implements LensOptionService {

    private final LensOptionRepository repository;

    public LensOptionServiceImpl(LensOptionRepository repository) {
        this.repository = repository;
    }

    // Create
    @Override
    public LensOption create(CreateLensOptionRequest request) {
        if (request.getExtraPrice() == null)
            throw new RuntimeException("Gia them khong duoc de trong!");

        LensOption lensOption = LensOption.builder()
                .optionName(request.getOptionName())
                .indexValue(request.getIndexValue())
                .coating(request.getCoating())
                .extraPrice(request.getExtraPrice())
                .build();

        return repository.save(lensOption);
    }

    // Update
    @Override
    public LensOption update(Integer id, UpdateLensOptionRequest request) {
        LensOption lensOption = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn tròng kính"));

        if (request.getIndexValue() != null) {
            if (request.getIndexValue().trim().isEmpty()) {
                throw new RuntimeException("Chiết suất không được để trống");
            }
            lensOption.setIndexValue(request.getIndexValue().trim());
        }

        if (request.getCoating() != null) {
            if (request.getCoating().trim().isEmpty()) {
                throw new RuntimeException("Lớp phủ không được để trống");
            }
            lensOption.setCoating(request.getCoating().trim());
        }

        if (request.getExtraPrice() != null) {
            if (request.getExtraPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Phụ phí phải lớn hơn hoặc bằng 0");
            }
            lensOption.setExtraPrice(request.getExtraPrice());
        }

        return repository.save(lensOption);
    }

    // Delete
    @Override
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tùy chọn tròng kính");
        }
        repository.deleteById(id);
    }

    // Get by id
    @Override
    public LensOption getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn tròng kính"));
    }

    // Get all
    @Override
    public List<LensOption> getAll() {
        return repository.findAll();
    }

    // Validate create
    private void validateLensOptionData(String indexValue, String coating, BigDecimal extraPrice) {
        if (extraPrice != null && extraPrice.compareTo(java.math.BigDecimal.ZERO) < 0)
            throw new RuntimeException("Phu phi phai lon hon hoac bang 0");
    }
}