package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateReadyMadeGlassesRequest {

    @NotNull
    private Integer frameId;

    @NotNull
    private Integer lensId;

    @NotBlank
    private String fixedPrescription;

    @NotNull
    private BigDecimal price;
}
