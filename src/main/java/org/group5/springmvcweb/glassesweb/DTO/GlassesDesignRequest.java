package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GlassesDesignRequest {

    @NotNull(message = "Vui long chon ho so mat")
    private Integer eyeProfileId;

    @NotNull(message = "Vui long chon gong kinh")
    private Integer frameId;

    @NotNull(message = "Vui long chon trong kinh")
    private Integer lensId;

    private List<Integer> selectedOptionIds;
    private String designName;
}