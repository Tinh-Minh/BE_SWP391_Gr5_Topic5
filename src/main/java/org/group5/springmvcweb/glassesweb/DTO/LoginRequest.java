package org.group5.springmvcweb.glassesweb.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String identifier;  // username hoặc email

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}