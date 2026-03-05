package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.CreateLensRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateLensRequest;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Repository.LensRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LensService {
    @Autowired
    private LensRepository lensRepository;

    //Create Lens
    public Lens createLens(CreateLensRequest request){
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
    public Lens getLensById(Integer id){
        return lensRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Lens khon ton tai"));
    }

    public List<Lens> getAllLens(){
        return lensRepository.findAll();
    }

    //Update
    public Lens updateLens(Integer id, UpdateLensRequest request){
        //tìm lens trong DB
        Lens lens = lensRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Khong tim thay"));

        //Set dữ liệu mới
        lens.setBrand(request.getBrand());
        lens.setLensType(request.getLensType());
        lens.setMinSph(request.getMinSph());
        lens.setMaxSph(request.getMaxSph());
        lens.setBasePrice(request.getBasePrice());
        //lưu lại
        return lensRepository.save(lens);
    }

    //delete
    public void deleteLens(Integer id){
       if(!lensRepository.existsById(id)){
           throw new RuntimeException("Lens Not Found");
       }
       lensRepository.deleteById(id);

    }


}
