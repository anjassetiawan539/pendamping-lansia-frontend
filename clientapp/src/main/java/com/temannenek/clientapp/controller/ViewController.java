package com.temannenek.clientapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String showLanding() {
        return "pages/landing";
    }

    @GetMapping("/dashboard/lansia")
    public String showLansiaDashboard() {
        return "pages/dashboard/lansia";
    }

    @GetMapping("/dashboard/relawan")
    public String showRelawanDashboard() {
        return "pages/dashboard/relawan";
    }

    @GetMapping("/login")
    public String showLogin() {
        return "pages/auth/login";
    }

    @GetMapping("/register")
    public String showRegister() {
        return "pages/auth/register";
    }
}
