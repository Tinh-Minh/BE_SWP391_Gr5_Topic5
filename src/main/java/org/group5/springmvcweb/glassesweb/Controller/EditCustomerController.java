package org.group5.springmvcweb.glassesweb.Controller;



import ch.qos.logback.core.model.Model;
import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.EditCustomerRequest;
import org.group5.springmvcweb.glassesweb.Entity.Customer;
import org.group5.springmvcweb.glassesweb.Repository.CustomerRepository;
import org.group5.springmvcweb.glassesweb.Service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class EditCustomerController {
    @Autowired
    CustomerService customerService;

    @PutMapping("/edit")
    public ResponseEntity<?> updateCustomer(
            @Valid @RequestBody EditCustomerRequest request
    ) {

        Customer updatedCustomer = customerService.editProfile(request);

        return ResponseEntity.ok("Cập nhật tài khoản thành công");
    }
}
