// class test when jwt access and link to test controler
package org.group5.springmvcweb.glassesweb.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Access granted - JWT works!";
    }
}