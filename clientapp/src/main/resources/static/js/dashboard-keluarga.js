$(document).ready(function() {

    const USER_API_URL = "http://localhost:9000/api/user/me";
    const ASSIGNMENT_BY_REQUEST_API = (requestId) => `http://localhost:9000/api/assignments/request/${requestId}`;
    const REVIEW_API_URL = "http://localhost:9000/api/reviews";
    let currentUserId = null;

    // ===================================
    // 1. CEK KEAMANAN (PENTING!)
    // ===================================
    // Cek apakah token ada di localStorage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    if (!token || role !== 'keluarga') {
        // Jika tidak ada token, atau role bukan keluarga, tendang kembali ke login
        alert("Anda harus login sebagai Keluarga untuk mengakses halaman ini.");
        window.location.href = "/login.html";
        return; // Hentikan eksekusi script
    }

    // ===================================
    // 2. LOGIKA LOGOUT
    // ===================================
    $("#logout-button").click(function() {
        // Hapus data dari localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        // Redirect ke login
        alert("Anda berhasil logout.");
        window.location.href = "/login.html";
    });

    loadProfile();

    function loadProfile() {
        $("#user-table tbody").html(`<tr><td colspan="2">Memuat data...</td></tr>`);
        $.ajax({
            method: "GET",
            url: USER_API_URL,
            headers,
            success: renderUserRow,
            error: handleFetchError
        });
    }

    function renderUserRow(user) {
        if (!user || !user.userId) {
            $("#user-table tbody").html(`<tr><td colspan="2">Profil tidak ditemukan.</td></tr>`);
            return;
        }
        currentUserId = user.userId;
        $("#greeting-name").text(user.fullname ?? user.username ?? "Keluarga");
        localStorage.setItem('userId', currentUserId);
        $("#user-table tbody").html(`
            <tr>
                <td>${user.fullname ?? user.username ?? "-"}</td>
                <td>${user.email ?? "-"}</td>
            </tr>
        `);
    }

    function handleFetchError(xhr) {
        if (xhr.status === 401) {
            alert("Sesi tidak valid, silakan login.");
            window.location.href = "/login.html";
            return;
        }
        $("#user-table tbody").html(`<tr><td colspan="2">Gagal memuat (${xhr.status}).</td></tr>`);
        console.error("Load users failed:", xhr.responseText);
    }

    // ===================================
    // 3. MEMUAT DATA PERMINTAAN (CONTOH)
    // ===================================
    // (Ini adalah tempat Anda akan memanggil API serverapp untuk data)
    
    // --- SIMULASI DATA (Hapus jika serverapp siap) ---
    // console.log("Memuat data dashboard...");
    // setTimeout(() => {
    //     $("#request-list").html(`
    //         <ul class="list-group">
    //             <li class="list-group-item d-flex justify-content-between align-items-center">
    //                 Bantu Belanja Mingguan
    //                 <span class="badge bg-warning">Scheduled</span>
    //             </li>
    //             <li class="list-group-item d-flex justify-content-between align-items-center">
    //                 Teman Ngobrol (Selesai)
    //                 <span class="badge bg-success">Done</span>
    //             </li>
    //         </ul>
    //     `);
    // }, 1000); // Simulasi delay 1 detik

    $("#review-form").on("submit", function(event) {
        event.preventDefault();
        $("#review-feedback").addClass("d-none").removeClass("alert-success alert-danger").text("");

        const requestId = parseInt($("#review-request-id").val(), 10);
        const rating = parseInt($("#review-rating").val(), 10);
        const comment = $("#review-comment").val();

        if (!requestId || !rating || !currentUserId) {
            showReviewFeedback("Request ID dan rating wajib diisi.", true);
            return;
        }

        fetchAssignmentVolunteer(requestId)
            .done(assignments => {
                if (!Array.isArray(assignments) || assignments.length === 0) {
                    showReviewFeedback("Tidak ditemukan relawan untuk permintaan tersebut.", true);
                    return;
                }
                const volunteer = assignments[0].volunteer;
                const volunteerId = volunteer ? volunteer.userId : null;
                if (!volunteerId) {
                    showReviewFeedback("Data relawan tidak lengkap untuk permintaan tersebut.", true);
                    return;
                }
                submitReview(requestId, rating, comment, volunteerId);
            })
            .fail(xhr => handleReviewError(xhr));
    });

    function fetchAssignmentVolunteer(requestId) {
        return $.ajax({
            method: "GET",
            url: ASSIGNMENT_BY_REQUEST_API(requestId),
            headers
        });
    }

    function submitReview(requestId, rating, comment, volunteerId) {
        $.ajax({
            method: "POST",
            url: REVIEW_API_URL,
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                requestId,
                reviewerUserId: currentUserId,
                revieweeUserId: volunteerId,
                rating,
                comment
            }),
            success: () => {
                showReviewFeedback("Terima kasih! Ulasan berhasil dikirim.", false);
                $("#review-form")[0].reset();
            },
            error: handleReviewError
        });
    }

    function handleReviewError(xhr) {
        if (xhr.status === 401) {
            alert("Sesi tidak valid, silakan login.");
            window.location.href = "/login.html";
            return;
        }
        const message = (xhr.responseJSON && xhr.responseJSON.message) || "Gagal mengirim ulasan.";
        showReviewFeedback(message, true);
    }

    function showReviewFeedback(message, isError) {
        $("#review-feedback")
            .removeClass("d-none alert-success alert-danger")
            .addClass(isError ? "alert alert-danger" : "alert alert-success")
            .text(message);
    }
});
