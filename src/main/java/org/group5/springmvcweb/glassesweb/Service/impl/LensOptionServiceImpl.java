package org.group5.springmvcweb.glassesweb.Service.impl;

import jakarta.validation.constraints.NotNull;
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


    @Override
    public LensOption create(CreateLensOptionRequest request) {
        validateLensOptionData(
                request.getIndexValue(),
                request.getCoating(),
                request.getExtraPrice()
        );
        LensOption lens = LensOption.builder()
                .indexValue(request.getIndexValue())
                .coating(request.getCoating())
                .extraPrice(request.getExtraPrice())
                .build();
        return repository.save(lens);
    }

    @Override
    public LensOption update(Integer id, UpdateLensOptionRequest request) {
        LensOption lensOption = repository.findById(id).orElseThrow(() ->
                new RuntimeException("LensOption not found with id " + id));
        if (request.getIndexValue() != null) {
            if (request.getIndexValue().trim().isEmpty()) {
                throw new RuntimeException("Index value must not be blank");
            }
            lensOption.setIndexValue(request.getIndexValue().trim());
        }

        if (request.getCoating() != null) {
            if (request.getCoating().trim().isEmpty()) {
                throw new RuntimeException("Coating must not be blank");
            }
            lensOption.setCoating(request.getCoating().trim());
        }

        if (request.getExtraPrice() != null) {
            if (request.getExtraPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Extra price must be greater than or equal to 0");
            }
            lensOption.setExtraPrice(request.getExtraPrice());
        }

        return repository.save(lensOption);
    }

    @Override
    public void delete(Integer id) {
        if(!repository.existsById(id)) {
            throw new RuntimeException("LensOption not found with id " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public LensOption getById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new RuntimeException("LensOption not found with id " + id));
    }

    @Override
    public List<LensOption> getAll() {
        return repository.findAll();
    }

    private void validateLensOptionData(String indexValue, String coating, @NotNull BigDecimal extraPrice) {
        if (indexValue == null || indexValue.trim().isEmpty()) {
            throw new RuntimeException("Index value must not be blank");
        }

        if (coating == null || coating.trim().isEmpty()) {
            throw new RuntimeException("Coating must not be blank");
        }

        if (extraPrice == null || extraPrice.compareTo(new BigDecimal(0)) < 0) {
            throw new RuntimeException("Extra price must be greater than or equal to 0");
        }
    }
}
