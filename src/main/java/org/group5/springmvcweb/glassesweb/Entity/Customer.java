package org.group5.springmvcweb.glassesweb.Entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Customer")

public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int customer_id;

    // Tên không được null và không được rỗng
    @NotBlank(message = "Name không được để trống")
    @Size(min = 2, max = 100, message = "Name phải từ 2 đến 100 ký tự")
    private String name;

    // Email đúng format
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    // Phone chỉ cho số và 9-11 ký tự
    @NotBlank(message = "Phone không được để trống")
    @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    // Địa chỉ không được trống
    @NotBlank(message = "Address không được để trống")
    private String address;

    // Status chỉ được ACTIVE hoặc INACTIVE
    @NotBlank(message = "Status không được để trống")
    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status phải là ACTIVE hoặc INACTIVE")
    private String status;

}
