$(document).ready(function() {

    const DEV_BYPASS = false; // Set ke true untuk bypass login saat development
    const USER_API_URL = "http://localhost:9000/api/user";

    if (DEV_BYPASS) {
        localStorage.setItem('authToken', 'dev-token');
        localStorage.setItem('userRole', 'keluarga');
    }

    // ===================================
    // 1. CEK KEAMANAN (PENTING!)
    // ===================================
    // Cek apakah token ada di localStorage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    if (!DEV_BYPASS && (!token || role !== 'keluarga')) {
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
        
        // Redirect ke login
        alert("Anda berhasil logout.");
        window.location.href = "/login.html";
    });

    loadUsers();

    function loadUsers() {
    $("#user-table tbody").html(`<tr><td colspan="3">Memuat data...</td></tr>`);
    $.ajax({
        method: "GET",
        url: USER_API_URL,
        headers,
        success: renderUserTable,
        error: handleFetchError
    });
    }

    function renderUserTable(users) {
        if (!Array.isArray(users) || users.length === 0) {
            $("#user-table tbody").html(`<tr><td colspan="3">Belum ada data.</td></tr>`);
            return;
        }
        const rows = users.map(user => `
            <tr>
            <td>${user.userId ?? "-"}</td>
            <td>${user.email ?? "-"}</td>
            </tr>
        `).join("");
        $("#user-table tbody").html(rows);
        }

        function handleFetchError(xhr) {
        if (xhr.status === 401) {
            alert("Sesi tidak valid, silakan login.");
            window.location.href = "/login.html";
            return;
        }
        $("#user-table tbody").html(`<tr><td colspan="3">Gagal memuat (${xhr.status}).</td></tr>`);
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
});