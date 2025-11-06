package com.temannenek.clientapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    /**
     * Ini adalah metode untuk menangani URL root ("/").
     * Saat seseorang mengunjungi "http://localhost:8080/",
     * metode ini akan berjalan.
     */
    @GetMapping("/")
    public String rootRedirect() {
        
        // "redirect:/index.html"
        // Ini adalah perintah untuk memberitahu browser:
        // "Tolong alihkan pengguna ke file statis /index.html"
        
        return "redirect:/index.html";
    }
}