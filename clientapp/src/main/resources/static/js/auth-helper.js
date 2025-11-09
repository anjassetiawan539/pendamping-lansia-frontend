// Session Manager - Shared authentication helper
const SessionManager = {
    setUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },

    getUser() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    clearUser() {
        sessionStorage.removeItem('currentUser');
    },

    isLoggedIn() {
        return this.getUser() !== null;
    },

    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }
};

// Logout function (dapat dipanggil dari dashboard)
function logout() {
    SessionManager.clearUser();
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    }
    window.location.href = '/login';
}

// Auth Guard - panggil ini di halaman yang memerlukan login
function requireAuth() {
    if (!SessionManager.isLoggedIn()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Role Guard - panggil ini di halaman yang memerlukan role tertentu
function requireRole(allowedRoles) {
    if (!requireAuth()) {
        return false;
    }

    const userRole = SessionManager.getUserRole();
    const normalizedRole = userRole ? userRole.toUpperCase() : '';
    const requiredRoles = (allowedRoles || []).map(role => role ? role.toUpperCase() : role);

    if (!requiredRoles.includes(normalizedRole)) {
        alert('Anda tidak memiliki akses ke halaman ini!');
        window.location.href = '/login';
        return false;
    }

    return true;
}
