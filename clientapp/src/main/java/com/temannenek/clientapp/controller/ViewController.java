package com.temannenek.clientapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    /**
     * Endpoint Utama (/)
     * Mengarahkan ke Dashboard Lansia sebagai halaman default,
     * yang akan memicu pemuatan dashboard_layout.html.
     */
    @GetMapping("/")
    public String showDefaultDashboard() {
        return "index.html";
    }

    @GetMapping("/dashboard_layout")
    public String showLayoutDashboard() {
        return "dashboard_layout";
    }


    // -------------------------------------------------------------------------
    // ENDPOINT DASHBOARD
    // -------------------------------------------------------------------------

    /**
     * Endpoint untuk Dashboard Lansia
     */
    @GetMapping("/dashboard-lansia")
    public String showLansiaDashboard() {
        return "folder_dashboard/dashboard_lansia";
    }

    /**
     * Endpoint untuk Dashboard Relawan
     */
    @GetMapping("/dashboard-relawan")
    public String showRelawanDashboard() {
        return "folder_dashboard/dashboard_relawan";
    }

    // -------------------------------------------------------------------------
    // ENDPOINT UTILITY
    // -------------------------------------------------------------------------

    /**
     * Endpoint untuk Halaman Login
     * (Asumsi ada file login.html di src/main/resources/templates/)
     */
    @GetMapping("/login")
    public String showLogin() {
        return "login";
    }
}