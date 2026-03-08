package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateLensOptionRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensOptionRequest;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Entity.LensOption;
import org.group5.springmvcweb.glassesweb.Repository.LensOptionRepository;
import org.group5.springmvcweb.glassesweb.Service.LensOptionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LensOptionServiceImpl implements LensOptionService {

    private final LensOptionRepository repository;

    public LensOptionServiceImpl(LensOptionRepository repository) {
        this.repository = repository;
    }


    @Override
    public LensOption create(CreateLensOptionRequest request) {
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
        lensOption.setIndexValue(request.getIndexValue());
        lensOption.setCoating(request.getCoating());
        lensOption.setExtraPrice(request.getExtraPrice());
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
}
