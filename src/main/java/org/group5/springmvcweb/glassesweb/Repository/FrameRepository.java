package org.group5.springmvcweb.glassesweb.Repository;

import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface FrameRepository extends JpaRepository<Frame,Integer> {
    //tìm kiếm theo brand
    List<Frame> findByBrandContainingIgnoreCase(String brand);

    //tìm kiếm theo khoảng gia
    List<Frame> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    //tìm theo brand + giá
    List<Frame> findByBrandContainingIgnoreCaseAndPriceBetween(String brand,
                                                               BigDecimal minPrice,
                                                               BigDecimal maxPrice);
}
