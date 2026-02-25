package org.group5.springmvcweb.glassesweb.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.group5.springmvcweb.glassesweb.Entity.Customer;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditCustomerRequest {

    private int id;
    private String name;
    private String email;
    private String phone;
    private String address;
}
