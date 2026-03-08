package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username not Empty")
    private String username;

    @NotBlank(message = "Password not Empty")
    private String password;
}