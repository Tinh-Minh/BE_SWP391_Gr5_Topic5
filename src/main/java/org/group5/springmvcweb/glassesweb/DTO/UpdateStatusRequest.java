package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateStatusRequest {

    @NotBlank(message = "Status not Empty")
    // ACTIVE hoặc BLOCKED
    private String status;
}