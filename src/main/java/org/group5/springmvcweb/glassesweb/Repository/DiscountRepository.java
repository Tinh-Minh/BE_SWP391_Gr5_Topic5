package org.group5.springmvcweb.glassesweb.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.group5.springmvcweb.glassesweb.entity.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    boolean existsByCode(String code);
    boolean existsByCodeAndDiscountIdNot(String code, Integer discountId);
}
