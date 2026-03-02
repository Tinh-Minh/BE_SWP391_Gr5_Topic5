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
    private Long lensId;

    @Column(name = "brand")
    private String brand;

    @Column(name = "lens_type")
    private String lensType;

    @Column(name = "min_sph")
    private BigDecimal minSph;

    @Column(name = "max_sph")
    private BigDecimal maxSph;

    @Column(name = "base_price")
    private BigDecimal basePrice;

}
