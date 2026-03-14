// File: MyGlassesServiceImpl.java
package org.group5.springmvcweb.glassesweb.Service.eye;

import org.group5.springmvcweb.glassesweb.Entity.MyGlasses;
import org.group5.springmvcweb.glassesweb.Entity.design.GlassesDesign;
import org.group5.springmvcweb.glassesweb.Repository.MyGlassesRepository;
import org.group5.springmvcweb.glassesweb.Repository.design.GlassesDesignRepository;
import org.group5.springmvcweb.glassesweb.Service.MyGlassesService;
import org.group5.springmvcweb.glassesweb.Service.design.GlassesDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyGlassesServiceImpl implements MyGlassesService {

    @Autowired
    private MyGlassesRepository myGlassesRepository;

    @Autowired
    private GlassesDesignRepository glassesDesignRepository;

    @Autowired
    private GlassesDesignService glassesDesignService;

    @Override
    public MyGlasses createFromDesign(Integer designId) {
        GlassesDesign design = glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế với id: " + designId));

        // Kiểm tra thiết kế hợp lệ (có frame, lens, tương thích độ kính) trước khi snapshot
        boolean isValid = glassesDesignService.validateDesign(designId);
        if (!isValid) {
            throw new RuntimeException("Thiết kế chưa hợp lệ: thiếu frame, lens hoặc không tương thích với độ kính");
        }

        // Kiểm tra design này đã được snapshot chưa (tránh tạo trùng)
        List<MyGlasses> existing = myGlassesRepository.findByDesignId(designId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Thiết kế này đã được lưu thành kính rồi");
        }

        // Tính giá và lưu
        double finalPrice = glassesDesignService.calculateTotalPrice(designId);

        MyGlasses myGlasses = new MyGlasses();
        myGlasses.setDesignId(designId);
        myGlasses.setFinalPrice(finalPrice);
        myGlasses.setStatus("COMPLETED");

        // Cập nhật status của design thành COMPLETED
        design.setStatus("COMPLETED");
        glassesDesignRepository.save(design);

        return myGlassesRepository.save(myGlasses);
    }

    @Override
    public List<MyGlasses> getMyGlasses(Integer customerId) {
        return myGlassesRepository.findByCustomerId(customerId);
    }

    @Override
    public MyGlasses getMyGlassesDetail(Integer myGlassesId) {
        return myGlassesRepository.findById(myGlassesId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy MyGlasses với id: " + myGlassesId));
    }
}