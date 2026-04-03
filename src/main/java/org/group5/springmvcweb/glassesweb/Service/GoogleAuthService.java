package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.LoginResponse;
import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Entity.Customer;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.group5.springmvcweb.glassesweb.Repository.CustomerRepository;
import org.group5.springmvcweb.glassesweb.util.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class GoogleAuthService {

    private final AccountRepository  accountRepository;
    private final CustomerRepository customerRepository;
    private final JwtUtil            jwtUtil;

    public GoogleAuthService(AccountRepository accountRepository,
                             CustomerRepository customerRepository,
                             JwtUtil jwtUtil) {
        this.accountRepository  = accountRepository;
        this.customerRepository = customerRepository;
        this.jwtUtil            = jwtUtil;
    }

    @Transactional
    public LoginResponse loginOrRegisterWithGoogle(String email, String name, String googleId) {

        // Tìm account theo username = email (quy ước cho Google login)
        Optional<Account> existingAccount = accountRepository.findByUsername(email);

        Account account;
        if (existingAccount.isPresent()) {
            // Account đã tồn tại → đăng nhập bình thường
            account = existingAccount.get();

            // Kiểm tra xem customer có bị block không
            if (account.getCustomer() != null &&
                    "BLOCKED".equals(account.getCustomer().getStatus())) {
                throw new RuntimeException("Tài khoản của bạn đã bị khóa!");
            }
        } else {
            // Chưa có account → tự động tạo mới (chỉ role USER)

            // Tạo Customer trước
            Customer customer = new Customer();
            customer.setName(name != null ? name : email);
            customer.setEmail(email);
            customer.setStatus("ACTIVE");
            Customer savedCustomer = customerRepository.save(customer);

            // Tạo Account với username = email, password = null (không dùng password)
            account = Account.builder()
                    .username(email)
                    .passwordHash(null)   // Google login không cần password
                    .role("USER")
                    .customer(savedCustomer)
                    .build();
            account = accountRepository.save(account);
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(account.getUsername(), account.getRole());
        return new LoginResponse(token);
    }
}