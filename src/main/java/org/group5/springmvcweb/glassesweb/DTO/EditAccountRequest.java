package org.group5.springmvcweb.glassesweb.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor


public class EditAccountRequest {
    private String oldUsername;
    private String newUsername;

    private String oldPassword;
    private String newPassword;

}
