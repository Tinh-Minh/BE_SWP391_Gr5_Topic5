package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Old Password not Empty!")
    private String oldPassword;

    @NotBlank(message = "New Password not Empty!")
    @Size(min = 6, message = "New Password must be at least 6 characters long!")
    private String newPassword;
}