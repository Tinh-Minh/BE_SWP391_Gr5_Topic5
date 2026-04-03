package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateLensOptionRequest {
    private String optionName;   // Ten tuy chon (VD: Anti-glare Coating)
    private String indexValue;   // Chiet suat (VD: 1.60)
    private String coating;      // Lop phu (VD: Premium)

    @Positive(message = "Extra price must be > 0")
    private BigDecimal extraPrice;
}