package org.group5.springmvcweb.glassesweb.Repository;

import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface LensRepository extends JpaRepository<Lens,Integer> {

    List<Lens> findByLensTypeContainingIgnoreCase(String lensType);

    List<Lens> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

}
