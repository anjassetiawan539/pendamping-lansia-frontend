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
        return renderLansiaPage(model, "Dashboard", "pages/dashboard/lansia/dashboard");
    }

    @GetMapping("/dashboard/lansia/req-layanan")
    public String showLansiaRequestMenu(Model model) {
        return renderLansiaPage(model, "Req Layanan", "pages/dashboard/lansia/requests");
    }

    @GetMapping("/dashboard/lansia/beri-rating")
    public String showLansiaRatingMenu(Model model) {
        return renderLansiaPage(model, "Beri Rating dan Ulasan", "pages/dashboard/lansia/reviews");
    }

    // =========================
    // DASHBOARD RELAWAN
    // =========================
    @GetMapping("/dashboard/relawan")
    public String showRelawanDashboard(Model model) {
        return renderRelawanPage(model, "Dashboard", "pages/dashboard/relawan/dashboard");
    }

    @GetMapping("/dashboard/relawan/tugas-layanan")
    public String showRelawanTaskMenu(Model model) {
        return renderRelawanPage(model, "Tugas Layanan", "pages/dashboard/relawan/tasks");
    }

    @GetMapping("/dashboard/relawan/lihat-rating")
    public String showRelawanRatingMenu(Model model) {
        return renderRelawanPage(model, "Lihat Rating dan Ulasan", "pages/dashboard/relawan/reviews");
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

    private String renderLansiaPage(Model model, String menuTitle, String viewName) {
        model.addAttribute("role", "lansia");
        model.addAttribute("menuTitle", menuTitle);
        model.addAttribute("pageTitle", buildPageTitle("lansia", menuTitle));
        return viewName;
    }

    private String renderRelawanPage(Model model, String menuTitle, String viewName) {
        model.addAttribute("role", "relawan");
        model.addAttribute("menuTitle", menuTitle);
        model.addAttribute("pageTitle", buildPageTitle("relawan", menuTitle));
        return viewName;
    }

    private String buildPageTitle(String role, String menuTitle) {
        if (role == null || role.isBlank()) {
            return "Dashboard - " + menuTitle;
        }
        String normalizedRole = role.substring(0, 1).toUpperCase() + role.substring(1);
        return "Dashboard " + normalizedRole + " - " + menuTitle;
    }
}
