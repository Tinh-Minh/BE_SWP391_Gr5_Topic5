// File: MyGlassesRepository.java
package org.group5.springmvcweb.glassesweb.Repository;

import org.group5.springmvcweb.glassesweb.Entity.MyGlasses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyGlassesRepository extends JpaRepository<MyGlasses, Integer> {
    @Query(value = "SELECT mg.* FROM MyGlasses mg " +
            "JOIN GlassesDesign gd ON mg.design_id = gd.design_id " +
            "JOIN EyeProfile ep ON gd.eye_profile_id = ep.eye_profile_id " +
            "WHERE ep.customer_id = :customerId",
            nativeQuery = true)
    List<MyGlasses> findByCustomerId(@Param("customerId") Integer customerId);

    List<MyGlasses> findByDesignId(Integer designId);
}