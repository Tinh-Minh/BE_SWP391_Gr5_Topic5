package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.EditCustomerRequest;
import org.group5.springmvcweb.glassesweb.Entity.Customer;
import org.group5.springmvcweb.glassesweb.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



    @Service
    public class CustomerService {

        @Autowired
        CustomerRepository repository;

        public Customer editProfile(EditCustomerRequest req) {

            Customer customer = repository.findById(req.getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            customer.setName(req.getName());
            customer.setEmail(req.getEmail());
            customer.setPhone(req.getPhone());
            customer.setAddress(req.getAddress());

            if (customer.getStatus() == null) {
                customer.setStatus("ACTIVE");
            }

            return repository.save(customer);
        }
    }
