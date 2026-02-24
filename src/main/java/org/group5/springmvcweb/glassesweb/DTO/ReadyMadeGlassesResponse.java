package org.group5.springmvcweb.glassesweb.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadyMadeGlassesResponse {
    // Thông tin ReadyMadeGlasses
    private Integer readyGlassesId;
    private Integer frameId;
    private Integer lensId;
    private String fixedPrescription;
    private BigDecimal price;

    //Thông tin từ frame
    private String frameBrand;
    private String frameMaterial;

    //thông tin từ lens
    private String lensType;

}
