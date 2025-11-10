const API_BASE_URL = "http://localhost:9000/api/auth";

const unwrapResponse = (response) => (response && typeof response === "object" && "data" in response ? response.data : response);
const hideError = (selector) => $(selector).addClass("d-none").text("");
const showError = (selector, message) => $(selector).text(message).removeClass("d-none");
const extractErrorMessage = (xhr, fallback) => {
    if (!xhr) {
        return fallback;
    }
    const payload = xhr.responseJSON;
    if (!payload) {
        return fallback;
    }
    if (typeof payload === "string" && payload.trim().length > 0) {
        return payload;
    }
    const messageCandidates = [
        payload.message,
        payload.detail,
        payload.error,
    ];
    for (const msg of messageCandidates) {
        if (typeof msg === "string" && msg.trim().length > 0) {
            return msg;
        }
    }
    if (payload.errors) {
        if (Array.isArray(payload.errors) && payload.errors.length > 0) {
            const firstError = payload.errors[0];
            if (typeof firstError === "string") {
                return firstError;
            }
            if (firstError?.defaultMessage) {
                return firstError.defaultMessage;
            }
            if (typeof firstError?.message === "string") {
                return firstError.message;
            }
        } else if (typeof payload.errors === "object") {
            const firstKey = Object.keys(payload.errors)[0];
            if (firstKey) {
                const messages = payload.errors[firstKey];
                if (Array.isArray(messages) && messages.length > 0) {
                    return messages[0];
                }
                if (typeof messages === "string" && messages.trim().length > 0) {
                    return messages;
                }
            }
        }
    }
    if (payload.data && typeof payload.data === "string" && payload.data.trim().length > 0) {
        return payload.data;
    }
    return fallback;
};

const isBlank = (value) => !value || !value.trim();
const normalizeOptional = (value) => {
    if (value === undefined || value === null) {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
};

const validateLoginPayload = ({ username, password }) => {
    if (isBlank(username) || isBlank(password)) {
        return "Username dan password wajib diisi.";
    }
    return null;
};

const validateRegisterPayload = ({ username, email, password, role }) => {
    if (isBlank(role)) {
        return "Silakan pilih peran pendaftaran.";
    }
    if (isBlank(username)) {
        return "Username wajib diisi.";
    }
    if (isBlank(email)) {
        return "Email wajib diisi.";
    }
    if (isBlank(password)) {
        return "Password wajib diisi.";
    }
    return null;
};

$(document).ready(function () {

    // ===================================
    // LOGIKA UNTUK FORM LOGIN (#login-form)
    // ===================================
    $("#login-form").submit(function (event) {
        // Mencegah reload halaman
        event.preventDefault();
        hideError("#login-error");

        // Ambil data
        const formData = {
            username: ($("#login-username").val() || "").trim(),
            password: $("#login-password").val() || ""
        };

        const validationError = validateLoginPayload(formData);
        if (validationError) {
            showError("#login-error", validationError);
            return;
        }

        // Kirim AJAX ke serverapp
        $.ajax({
            type: "POST",
            url: `${API_BASE_URL}/login`,
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",

            success: function (response) {
                const payload = unwrapResponse(response);
                if (!payload) {
                    $("#login-error").text("Login gagal! Coba beberapa saat lagi.").removeClass('d-none');
                    return;
                }
                const normalizedRole = (payload.role || "").toUpperCase();
                const navigationRole = normalizedRole.toLowerCase();
                localStorage.setItem('authToken', payload.token);
                localStorage.setItem('userRole', navigationRole);
                if (payload.userId) {
                    localStorage.setItem('userId', payload.userId);
                }

                if (typeof SessionManager !== "undefined") {
                    SessionManager.setUser({
                        userId: payload.userId || null,
                        username: payload.username || payload.email || "",
                        email: payload.email || "",
                        fullname: payload.fullname || payload.username || "",
                        role: normalizedRole || "USER"
                    });
                }

                if (navigationRole === "admin") {
                    window.location.href = "/dashboard/admin";
                } else if (navigationRole === "relawan") {
                    window.location.href = "/dashboard/relawan";
                } else if (navigationRole === "keluarga" || navigationRole === "lansia") {
                    window.location.href = "/dashboard/lansia";
                } else {
                    window.location.href = "/";
                }
            },
            error: function (xhr) {
                // Tampilkan pesan error
                const msg = extractErrorMessage(xhr, "Login gagal! Username atau password salah.");
                showError("#login-error", msg);
            }
        });
    });

    // =======================================
    // LOGIKA UNTUK FORM REGISTER (#register-form)
    // =======================================
    $("#register-form").submit(function (event) {
        event.preventDefault();
        hideError("#register-error");

        // Ambil data dari form register
        const formData = {
            username: ($("#register-username").val() || "").trim(),
            email: ($("#register-email").val() || "").trim(),
            password: $("#register-password").val() || "",
            role: ($("#register-role").val() || "").trim().toLowerCase(),
            fullname: normalizeOptional($("#register-fullname").val() || ""),
            phone: normalizeOptional($("#register-phone").val() || ""),
            province: normalizeOptional($("#register-province").val() || ""),
            city: normalizeOptional($("#register-city").val() || ""),
            addressDetail: normalizeOptional($("#register-address").val() || ""),
            bio: normalizeOptional($("#register-bio").val() || "")
        };

        const registerError = validateRegisterPayload(formData);
        if (registerError) {
            showError("#register-error", registerError);
            return;
        }

        // Kirim AJAX ke serverapp
        $.ajax({
            type: "POST",
            url: `${API_BASE_URL}/register`,
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",

            success: function () {
                alert("Pendaftaran berhasil! Silakan login.");
                window.location.href = "/login";
            },
            error: function (xhr) {
                // Tampilkan pesan error
                const msg = extractErrorMessage(xhr, "Pendaftaran gagal.");
                showError("#register-error", msg);
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
