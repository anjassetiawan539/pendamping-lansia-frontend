$(document).ready(function() {
    
    // ===================================
    // 1. CEK KEAMANAN (PENTING!)
    // ===================================
    // Cek apakah token ada di localStorage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

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
        
        // Redirect ke login
        alert("Anda berhasil logout.");
        window.location.href = "/login.html";
    });

    // ===================================
    // 3. MEMUAT DATA PERMINTAAN (CONTOH)
    // ===================================
    // (Ini adalah tempat Anda akan memanggil API serverapp untuk data)
    
    // --- SIMULASI DATA (Hapus jika serverapp siap) ---
    console.log("Memuat data dashboard...");
    setTimeout(() => {
        $("#request-list").html(`
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Bantu Belanja Mingguan
                    <span class="badge bg-warning">Scheduled</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Teman Ngobrol (Selesai)
                    <span class="badge bg-success">Done</span>
                </li>
            </ul>
        `);
    }, 1000); // Simulasi delay 1 detik
});