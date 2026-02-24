package org.group5.springmvcweb.glassesweb.Repository;

import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ReadyMadeGlassesRepository extends JpaRepository<ReadyMadeGlasses, Integer> {
    List<ReadyMadeGlasses> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);


}
