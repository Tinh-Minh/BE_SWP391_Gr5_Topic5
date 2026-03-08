package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.*;
import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Entity.Customer;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.group5.springmvcweb.glassesweb.Repository.CustomerRepository;
import org.group5.springmvcweb.glassesweb.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    //===== LOGIN =====

    public LoginResponse login(LoginRequest request) {
        Account user = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Wrong password");
        }
        Customer customer = customerRepository.findById(user.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not exist!"));

        if ("BLOCKED".equals(customer.getStatus())) {
            throw new RuntimeException("Account has been blocked!");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token);
    }

    // ===== REGISTER =====

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        // 1. Kiểm tra username đã tồn tại chưa
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        // 2. Kiểm tra email đã tồn tại chưa
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // 3. Tạo Customer trước (vì Account cần customerId)
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setStatus("ACTIVE");
        Customer savedCustomer = customerRepository.save(customer);

        // 4. Tạo Account liên kết với Customer vừa tạo
        Account account = new Account();
        account.setCustomerId(savedCustomer.getCustomerId());
        account.setUsername(request.getUsername());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        account.setRole("USER");
        account.setCreatedAt(LocalDateTime.now());
        Account savedAccount = accountRepository.save(account);

        return new RegisterResponse(
                savedAccount.getAccountId(),
                savedAccount.getUsername(),
                request.getEmail(),
                "Register Successful!"
        );
    }

    public void updateRole(Integer accountId, String newRole) {

        // Kiểm tra role hợp lệ hay không
        List<String> validRoles = List.of("USER", "ADMIN", "STAFF", "OPERATION");
        if (!validRoles.contains(newRole)) {
            throw new RuntimeException("Role not valid!");
        }
        // kiểm tra tài khoản có tồn tại không
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not exist!"));

        account.setRole(newRole);
        accountRepository.save(account);
    }
}