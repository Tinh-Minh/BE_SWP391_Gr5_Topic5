package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.Entity.Account;
import org.group5.springmvcweb.glassesweb.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";  // trả về templates/login.html
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model,
                        HttpSession session) {  // thêm session để lưu user nếu cần
        Account account = accountRepository.findByUsername(username);

        if (account != null && account.getPasswordHash().equals(password)) {  // so sánh plain text
            // Lưu thông tin user vào session (tùy chọn, để dùng sau)
            session.setAttribute("loggedInUser", account);
            model.addAttribute("username", username);
            return "redirect:/home";
        } else {
            model.addAttribute("error", "Tên đăng nhập hoặc mật khẩu không đúng");
            return "login";
        }
    }

    @GetMapping("/home")
    public String home() {
        return "home";  // templates/home.html
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();  // xóa session để logout hoàn toàn
        return "redirect:/login";
    }
}