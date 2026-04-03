package org.group5.springmvcweb.glassesweb.DTO;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GlassesDesignResponse {
    private Integer designId;
    private Integer customerId;
    private String  customerName;
    private Integer eyeProfileId;
    private String  eyeProfileName;
    private List<PrescriptionResponse> prescriptions; // thong so mat cua khach
    private Integer frameId;
    private String  frameName;
    private String  frameBrand;
    private String  frameColor;
    private String  frameMaterial;
    private String  frameSize;
    private String  frameRimType;
    private String  frameType;
    private BigDecimal framePrice;
    private Integer lensId;
    private String  lensName;
    private String  lensType;
    private BigDecimal lensBasePrice;
    private BigDecimal lensSph;
    private BigDecimal lensCyl;
    private List<GlassesDesignOptionResponse> selectedOptions;
    private BigDecimal totalPrice;
    private String  designName;
    private String  status;
    private LocalDateTime createdDate;
}