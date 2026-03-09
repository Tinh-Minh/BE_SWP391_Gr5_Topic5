package org.group5.springmvcweb.glassesweb.DTO;


import lombok.Data;

import java.math.BigDecimal;

@Data

public class UpdateFrameRequest {
    private String brand;

    private String material;

    private String size;

    private String rimType;

    private BigDecimal price;
}
