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
public class SearchRequest {

    //tìm kiếm chung
    private String keyword;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    //tìm kiếm frame
    private String brand;
    private String material;
    private String size;
    private String rimType;

    //tìm kiếm lens
    private String lensType;

    //Pagination
    private Integer page = 1;
    private Integer pageSize = 20;

}
