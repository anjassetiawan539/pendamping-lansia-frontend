package com.temannenek.clientapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String showLanding() {
        return "pages/landing";
    }

    // =========================
    // DASHBOARD LANSIA
    // =========================
    @GetMapping("/dashboard/lansia")
    public String showLansiaDashboard(Model model) {
        return renderDashboard(model, "lansia", "Dashboard");
    }

    @GetMapping("/dashboard/lansia/req-layanan")
    public String showLansiaRequestMenu(Model model) {
        return renderDashboard(model, "lansia", "Req Layanan");
    }

    @GetMapping("/dashboard/lansia/beri-rating")
    public String showLansiaRatingMenu(Model model) {
        return renderDashboard(model, "lansia", "Beri Rating dan Ulasan");
    }

    // =========================
    // DASHBOARD RELAWAN
    // =========================
    @GetMapping("/dashboard/relawan")
    public String showRelawanDashboard(Model model) {
        return renderDashboard(model, "relawan", "Dashboard");
    }

    @GetMapping("/dashboard/relawan/tugas-layanan")
    public String showRelawanTaskMenu(Model model) {
        return renderDashboard(model, "relawan", "Tugas Layanan");
    }

    @GetMapping("/dashboard/relawan/lihat-rating")
    public String showRelawanRatingMenu(Model model) {
        return renderDashboard(model, "relawan", "Lihat Rating dan Ulasan");
    }

    // =========================
    // DASHBOARD ADMIN
    // =========================
    @GetMapping("/dashboard/admin")
    public String showAdminDashboard() {
        return "pages/dashboard/admin";
    }

    @GetMapping("/login")
    public String showLogin() {
        return "pages/auth/login";
    }

    @GetMapping("/register")
    public String showRegister() {
        return "pages/auth/register";
    }

    private String renderDashboard(Model model, String role, String menuTitle) {
        model.addAttribute("role", role);
        model.addAttribute("menuTitle", menuTitle);
        model.addAttribute("pageTitle", buildPageTitle(role, menuTitle));
        model.addAttribute("menuMessage", "Ini adalah halaman Menu " + menuTitle + ".");
        return "pages/dashboard/menu-placeholder";
    }

    private String buildPageTitle(String role, String menuTitle) {
        if (role == null || role.isBlank()) {
            return "Dashboard - " + menuTitle;
        }
        String normalizedRole = role.substring(0, 1).toUpperCase() + role.substring(1);
        return "Dashboard " + normalizedRole + " - " + menuTitle;
    }
}
