package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateLensOptionRequest {

//    @NotNull
//    private Integer lensOptionId;

    private String indexValue;

    private String coating;

    private BigDecimal extraPrice;
}
