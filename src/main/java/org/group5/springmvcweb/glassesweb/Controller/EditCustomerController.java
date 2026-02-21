package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.Entity.Customer;
import org.group5.springmvcweb.glassesweb.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EditCustomerController {


    @Autowired
    CustomerRepository repository;

    public void updateProfile(int id, Customer newData) {

        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(newData.getName());
        customer.setEmail(newData.getEmail());
        customer.setPhone(newData.getPhone());
        customer.setAddress(newData.getAddress());

        repository.save(customer);
    }




}
