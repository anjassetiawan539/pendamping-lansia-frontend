// Gunakan URL API dari serverapp di sini
// const API_BASE_URL = "http://localhost:8081/api/auth";

$(document).ready(function () {

    // ===================================
    // LOGIKA UNTUK FORM LOGIN (#login-form)
    // ===================================
    $("#login-form").submit(function (event) {
        // Mencegah reload halaman
        event.preventDefault();
        $("#login-error").addClass('d-none').text("");

        // Ambil data
        var email = $("#login-email").val();
        var password = $("#login-password").val();
        var formData = {
            email: email,
            password: password
        };

        // Kirim AJAX ke serverapp
        $.ajax({
            type: "POST",
            url: `${API_BASE_URL}/login`,
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",

            success: function (response) {
                // Simpan token dan role
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userRole', response.role);

                // Arahkan berdasarkan role
                if (response.role === "keluarga") {
                    window.location.href = "/dashboard-keluarga.html";
                } else if (response.role === "relawan") {
                    window.location.href = "/dashboard-relawan.html"; // (Buat file ini nanti)
                } else if (response.role === "admin") {
                    window.location.href = "/dashboard-admin.html"; // (Buat file ini nanti)
                }
            },
            error: function (xhr) {
                // Tampilkan pesan error
                $("#login-error").text("Login gagal! Email atau password salah.").removeClass('d-none');
            }
        });
    });

    // =======================================
    // LOGIKA UNTUK FORM REGISTER (#register-form)
    // =======================================
    $("#register-form").submit(function (event) {
        event.preventDefault();
        $("#register-error").addClass('d-none').text("");

        // Ambil data dari form register
        var formData = {
            fullname: $("#register-fullname").val(),
            email: $("#register-email").val(),
            phone: $("#register-phone").val(),
            password: $("#register-password").val(),
            role: $("#register-role").val()
        };

        // Kirim AJAX ke serverapp
        $.ajax({
            type: "POST",
            url: `${API_BASE_URL}/register`,
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",

            success: function (response) {
                // Jika register sukses, langsung arahkan ke login
                alert("Pendaftaran berhasil! Silakan login.");
                window.location.href = "/login.html";
            },
            error: function (xhr) {
                // Tampilkan pesan error
                $("#register-error").text(xhr.responseJSON.message || "Pendaftaran gagal.").removeClass('d-none');
            }
        });
    });

    // ================================================
    // LOGIKA TAMBAHAN: SHOW/HIDE PASSWORD
    // ================================================
    $(".toggle-password").click(function() {
        
        // $(this) adalah tombol yang diklik
        let input = $(this).prev("input"); // Ambil input password tepat sebelum tombol ini
        let icon = $(this).find("i");     // Ambil elemen <i> di dalam tombol

        // Cek tipe input
        if (input.attr("type") === "password") {
            // 1. Ubah input ke 'text' (tampilkan password)
            input.attr("type", "text");
            // 2. Ubah ikon mata
            icon.removeClass("bi-eye-slash").addClass("bi-eye");
            
        } else {
            // 1. Ubah input ke 'password' (sembunyikan password)
            input.attr("type", "password");
            // 2. Ubah ikon mata kembali
            icon.removeClass("bi-eye").addClass("bi-eye-slash");
        }
    });

});