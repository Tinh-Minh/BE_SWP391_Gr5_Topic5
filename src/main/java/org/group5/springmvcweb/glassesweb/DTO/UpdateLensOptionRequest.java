package org.group5.springmvcweb.glassesweb.DTO;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateLensOptionRequest {


    private String indexValue;

    private String coating;

    private BigDecimal extraPrice;
}
