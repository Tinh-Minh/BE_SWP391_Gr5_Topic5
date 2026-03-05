package org.group5.springmvcweb.glassesweb.DTO;

import lombok.Builder;
import lombok.Data;
import org.group5.springmvcweb.glassesweb.Entity.Lens;

import java.math.BigDecimal;

@Data
@Builder
public class LensResponse {
    private Integer lensId;
    private String lensType;
    private BigDecimal minSph;
    private BigDecimal maxSph;
    private BigDecimal basePrice;

    public static LensResponse fromEntity(Lens lens){
        return LensResponse.builder()
                .lensId(lens.getLensId())
                .lensType(lens.getLensType())
                .minSph(lens.getMinSph())
                .maxSph(lens.getMaxSph())
                .basePrice(lens.getBasePrice())
                .build();
    }
}
