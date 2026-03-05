package org.group5.springmvcweb.glassesweb.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.group5.springmvcweb.glassesweb.Entity.Frame;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class FrameResponse {
    private Integer frameId;
    private String brand;
    private String material;
    private String size;
    private String rimType;
    private BigDecimal price;

    public static FrameResponse fromEntity(Frame frame) {
        return new FrameResponse(
                frame.getFrameId(),
                frame.getBrand(),
                frame.getMaterial(),
                frame.getSize(),
                frame.getRimType(),
                frame.getPrice()
        );
    }

}
