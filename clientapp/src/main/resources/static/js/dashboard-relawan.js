$(document).ready(function() {

    const USER_API_URL = "http://localhost:9000/api/user/me";
    const REVIEWS_API_URL = (userId) => `http://localhost:9000/api/reviews/user/${userId}`;

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    if (!token || role !== 'relawan') {
        alert("Anda harus login sebagai Relawan untuk mengakses halaman ini.");
        window.location.href = "/login.html";
        return;
    }

    $("#logout-button").click(function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        alert("Anda berhasil logout.");
        window.location.href = "/login.html";
    });

    loadProfile();

    function loadProfile() {
        $.ajax({
            method: "GET",
            url: USER_API_URL,
            headers,
            success: function(user) {
                if (!user || !user.userId) {
                    $("#review-table tbody").html(`<tr><td colspan="4">Profil tidak ditemukan.</td></tr>`);
                    return;
                }
                localStorage.setItem('userId', user.userId);
                $("#relawan-name").text(user.fullname ?? user.username ?? "Relawan");
                loadReviews(user.userId);
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    alert("Sesi tidak valid, silakan login.");
                    window.location.href = "/login.html";
                    return;
                }
                $("#review-table tbody").html(`<tr><td colspan="4">Gagal memuat profil.</td></tr>`);
            }
        });
    }

    function loadReviews(userId) {
        $("#review-table tbody").html(`<tr><td colspan="4">Memuat ulasan...</td></tr>`);
        $.ajax({
            method: "GET",
            url: REVIEWS_API_URL(userId),
            headers,
            success: renderReviewTable,
            error: function(xhr) {
                if (xhr.status === 401) {
                    alert("Sesi tidak valid, silakan login.");
                    window.location.href = "/login.html";
                    return;
                }
                $("#review-table tbody").html(`<tr><td colspan="4">Gagal memuat ulasan.</td></tr>`);
            }
        });
    }

    function renderReviewTable(reviews) {
        if (!Array.isArray(reviews) || reviews.length === 0) {
            $("#review-table tbody").html(`<tr><td colspan="4">Belum ada ulasan.</td></tr>`);
            return;
        }

        const rows = reviews.map(review => {
            const requestId = review.request ? review.request.requestId : "-";
            const rating = review.rating ?? "-";
            const comment = review.comment ?? "-";
            const reviewerName = review.reviewer
                ? (review.reviewer.fullname || review.reviewer.username || "-")
                : "-";
            return `
                <tr>
                    <td>${requestId}</td>
                    <td>${rating}</td>
                    <td>${comment}</td>
                    <td>${reviewerName}</td>
                </tr>
            `;
        }).join("");
        $("#review-table tbody").html(rows);
    }
});
