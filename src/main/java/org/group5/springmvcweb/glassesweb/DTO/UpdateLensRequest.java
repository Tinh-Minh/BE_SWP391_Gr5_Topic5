package org.group5.springmvcweb.glassesweb.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateLensRequest {
    private String brand;
    private String lensType;
    private BigDecimal minSph;
    private BigDecimal maxSph;
    private BigDecimal basePrice;
}
