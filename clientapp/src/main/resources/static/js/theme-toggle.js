function applyTheme(isDarkMode) {
    const body = document.body;
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Inisialisasi tema saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default ke dark
    applyTheme(savedTheme === 'dark');

    // Tambahkan event listener untuk tombol toggle di navbar
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme === 'dark');
            updateToggleButton(newTheme);
        });
        updateToggleButton(savedTheme); // Atur ikon tombol saat dimuat
    }
});

function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (button) {
        if (theme === 'dark') {
            button.innerHTML = '<i class="bi bi-sun-fill"></i>'; // Ikon matahari untuk beralih ke light
        } else {
            button.innerHTML = '<i class="bi bi-moon-fill"></i>'; // Ikon bulan untuk beralih ke dark
        }
    }
}