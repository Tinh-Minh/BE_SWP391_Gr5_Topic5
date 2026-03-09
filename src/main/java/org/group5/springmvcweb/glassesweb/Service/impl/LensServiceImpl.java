package org.group5.springmvcweb.glassesweb.Service.impl;

import org.group5.springmvcweb.glassesweb.DTO.CreateLensRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensRequest;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Repository.LensRepository;
import org.group5.springmvcweb.glassesweb.Service.LensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LensServiceImpl implements LensService {

    private final LensRepository lensRepository;

    public LensServiceImpl(LensRepository lensRepository) {
        this.lensRepository = lensRepository;
    }

    //Create Lens
    @Override
    public Lens createLens(CreateLensRequest request){
        validateLensData(
                request.getBrand(),
                request.getLensType(),
                request.getMinSph(),
                request.getMaxSph(),
                request.getBasePrice()
        );
        Lens lens = Lens.builder()
                .brand(request.getBrand())
                .lensType(request.getLensType())
                .minSph(request.getMinSph())
                .maxSph(request.getMaxSph())
                .basePrice(request.getBasePrice())
                .build();
        return lensRepository.save(lens);

    }

    //Search
    @Override
    public Lens getLensById(Integer id){
        return lensRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Lens khon ton tai"));
    }

    @Override
    public List<Lens> getAllLens(){
        return lensRepository.findAll();
    }

    //Update
    @Override
    public Lens updateLens(Integer id, UpdateLensRequest request){
        //tìm lens trong DB
        Lens lens = lensRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Khong tim thay"));

        //Set dữ liệu mới
        BigDecimal newMinSph = request.getMinSph() != null ? request.getMinSph() : lens.getMinSph();
        BigDecimal newMaxSph = request.getMaxSph() != null ? request.getMaxSph() : lens.getMaxSph();
        BigDecimal newBasePrice = request.getBasePrice() != null ? request.getBasePrice() : lens.getBasePrice();

        if (request.getBrand() != null) {
            if (request.getBrand().trim().isEmpty()) {
                throw new RuntimeException("Brand must not be blank");
            }
            lens.setBrand(request.getBrand().trim());
        }

        if (request.getLensType() != null) {
            if (request.getLensType().trim().isEmpty()) {
                throw new RuntimeException("Lens type must not be blank");
            }
            lens.setLensType(request.getLensType().trim());
        }

        if (newBasePrice == null || newBasePrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Base price must be greater than 0");
        }

        if (newMinSph != null && newMaxSph != null && newMinSph.compareTo(newMaxSph) > 0) {
            throw new RuntimeException("minSph must be less than or equal to maxSph");
        }

        if (request.getMinSph() != null) {
            lens.setMinSph(request.getMinSph());
        }

        if (request.getMaxSph() != null) {
            lens.setMaxSph(request.getMaxSph());
        }

        if (request.getBasePrice() != null) {
            lens.setBasePrice(request.getBasePrice());
        }

        //lưu lại
        return lensRepository.save(lens);
    }

    //delete
    @Override
    public void deleteLens(Integer id){
       if(!lensRepository.existsById(id)){
           throw new RuntimeException("Lens Not Found");
       }
       lensRepository.deleteById(id);

    }

    private void validateLensData(String brand, String lensType,
                                  BigDecimal minSph, BigDecimal maxSph, BigDecimal basePrice){
        if(brand == null || brand.trim().isEmpty()){
            throw new RuntimeException("Brand must not be blank");
        }
        if(lensType == null || lensType.trim().isEmpty()){
            throw new RuntimeException("LensType must not be blank");
        }
        if(basePrice == null || basePrice.compareTo(new BigDecimal(0)) <= 0){
            throw new RuntimeException("Base Price must be greater than 0");
        }
        if(minSph != null && maxSph != null && minSph.compareTo(maxSph) > 0){
            throw new RuntimeException("minSph must be less than or equal to maxSph");
        }
    }

}
