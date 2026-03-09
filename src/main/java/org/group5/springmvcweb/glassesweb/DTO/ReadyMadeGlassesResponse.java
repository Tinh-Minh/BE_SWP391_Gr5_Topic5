package org.group5.springmvcweb.glassesweb.DTO;

import lombok.Builder;
import lombok.Data;
import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;

import java.math.BigDecimal;

@Data
@Builder
public class ReadyMadeGlassesResponse {
    private String readyGlassesId;
    private Integer frameId;
    private Integer lensId;
    private String fixedPrescription;
    private BigDecimal price;

    public static ReadyMadeGlassesResponse fromEntity(ReadyMadeGlasses readyMadeGlasses) {
        return ReadyMadeGlassesResponse.builder()
                .readyGlassesId(readyMadeGlasses.getReadyGlassesId())
                .frameId(readyMadeGlasses.getFrameId())
                .lensId(readyMadeGlasses.getLensId())
                .fixedPrescription(readyMadeGlasses.getFixedPrescription())
                .price(readyMadeGlasses.getPrice())
                .build();
    }
}
