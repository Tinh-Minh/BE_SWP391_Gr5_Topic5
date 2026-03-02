package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateFrameRequest {

    @NotBlank
    private String brand;

    @NotBlank
    private String material;

    @NotBlank
    private String size;

    @NotBlank
    private String rimType;

    @NotNull
    private BigDecimal price;
}
