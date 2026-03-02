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

    @Column(name = "brand")
    private String brand;

    @Column(name = "material")
    private String material;

    @Column(name = "size")
    private String size;

    @Column(name = "rim_type")
    private String rimType;

    @Column(name = "price")
    private BigDecimal price;


}
