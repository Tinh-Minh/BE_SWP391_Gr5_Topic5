package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateLensOptionRequest {
    @NotBlank
    private String indexValue;

    @NotBlank
    private String coating;

    @NotNull
    private BigDecimal extraPrice;
}
