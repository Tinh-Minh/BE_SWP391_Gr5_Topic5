package org.group5.springmvcweb.glassesweb.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Lens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Lens {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lens_id")
    private Integer lensId;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "lens_type", nullable = false)
    private String lensType;

    @Column(name = "min_sph",  precision = 5, scale = 2)
    private BigDecimal minSph;

    @Column(name = "max_sph",  precision = 5, scale = 2)
    private BigDecimal maxSph;

    @Column(name = "base_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal basePrice;

}
