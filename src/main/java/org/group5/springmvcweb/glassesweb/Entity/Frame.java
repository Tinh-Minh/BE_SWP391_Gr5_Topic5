package org.group5.springmvcweb.glassesweb.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Frame")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Frame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "frame_id")
    private Integer frameId;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "material", nullable = false)
    private String material;

    @Column(name = "size", nullable = false)
    private String size;

    @Column(name = "rim_type", nullable = false)
    private String rimType;

    @Column(name = "price", nullable = false, precision = 18, scale = 2)
    private BigDecimal price;


}