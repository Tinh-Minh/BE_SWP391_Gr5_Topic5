package org.group5.springmvcweb.glassesweb.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateReadyMadeGlassesRequest {
    private Integer frameId;
    private Integer lensId;
    private String fixedPrescription;
    private BigDecimal price;

}
