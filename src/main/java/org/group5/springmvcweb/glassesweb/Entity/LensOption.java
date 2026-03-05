package org.group5.springmvcweb.glassesweb.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "LensOption")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LensOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lens_option_id")
    private Integer lensOptionId;

    @Column(name = "index_value")
    private String indexValue;

    @Column(name = "coating")
    private String coating;

    @Column(name = "extra_price")
    private BigDecimal extraPrice;
}
