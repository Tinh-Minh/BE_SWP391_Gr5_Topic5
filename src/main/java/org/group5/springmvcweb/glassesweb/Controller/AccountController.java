package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountRepository accountRepo;

    public AccountController(AccountRepository accountRepo) {
        this.accountRepo = accountRepo;
    }

    @GetMapping
    public List<Account> getAll() {
        return accountRepo.findAll();
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        return accountRepo.save(account);
    }
}
