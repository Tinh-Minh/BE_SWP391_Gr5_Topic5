package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateLensRequest {
    @NotBlank
    private String brand;

    @NotBlank
    private String lensType;

    @NotNull
    private BigDecimal minSph;

    @NotNull
    private BigDecimal maxSph;

    @NotNull
    private BigDecimal basePrice;

}
