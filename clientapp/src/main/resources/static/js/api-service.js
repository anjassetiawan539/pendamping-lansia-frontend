// API Service - Wrapper untuk semua API calls
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:9000/api';
        this._sessionExpiredHandled = false;
    }

    normalizeNumericId(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || Number.isNaN(parsed) || !Number.isInteger(parsed)) {
            return null;
        }
        return parsed;
    }

    ensureValidId(value, label = 'ID data') {
        const normalized = this.normalizeNumericId(value);
        if (normalized === null || normalized <= 0) {
            throw new Error(`${label} tidak valid. Silakan muat ulang halaman dan coba lagi.`);
        }
        return normalized;
    }

    getAuthToken() {
        if (typeof window === 'undefined') {
            return null;
        }
        const rawToken = localStorage.getItem('authToken') ||
            sessionStorage.getItem('authToken') ||
            null;
        return this.normalizeToken(rawToken);
    }

    normalizeToken(rawToken) {
        if (!rawToken) {
            return null;
        }
        const trimmed = rawToken.toString().trim();
        if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
            return null;
        }
        return trimmed;
    }

    ensureActiveToken() {
        const token = this.getAuthToken();
        if (!token) {
            return null;
        }
        if (this.isTokenExpired(token)) {
            this.handleSessionExpiry();
            return null;
        }
        this._sessionExpiredHandled = false;
        return token;
    }

    isTokenExpired(token) {
        if (!token) {
            return true;
        }
        try {
            const payload = this.decodeTokenPayload(token);
            if (!payload || !payload.exp) {
                return false;
            }
            const nowSeconds = Math.floor(Date.now() / 1000);
            return payload.exp <= nowSeconds;
        } catch (error) {
            console.warn('Gagal membaca payload token:', error);
            return true;
        }
    }

    decodeTokenPayload(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const decoded = atob(padded);
        return JSON.parse(decoded);
    }

    handleSessionExpiry() {
        if (this._sessionExpiredHandled) {
            return;
        }
        this._sessionExpiredHandled = true;
        if (typeof SessionManager !== 'undefined') {
            SessionManager.clearUser();
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
        }
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('authToken');
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('session-expired'));
        }
    }

    buildAuthError(message) {
        const error = new Error(message);
        error.status = 401;
        error.code = 'AUTH_REQUIRED';
        return error;
    }

    buildHeaders(customHeaders = {}, hasJsonBody = false, requireAuth = true) {
        const headers = new Headers(customHeaders);
        const token = requireAuth ? this.ensureActiveToken() : null;

        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        if (hasJsonBody && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        return headers;
    }

    // Helper untuk fetch dengan error handling
    async request(url, options = {}) {
        const {
            requireAuth = true,
            ...fetchOptions
        } = options;

        const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
        const shouldStringify = hasBody &&
            typeof fetchOptions.body === 'object' &&
            !(fetchOptions.body instanceof FormData) &&
            !(fetchOptions.body instanceof Blob);

        const isJsonString = hasBody && typeof fetchOptions.body === 'string';
        const payloadBody = shouldStringify ? JSON.stringify(fetchOptions.body) : fetchOptions.body;
        const headers = this.buildHeaders(fetchOptions.headers, shouldStringify || isJsonString, requireAuth);

        if (requireAuth && !headers.has('Authorization')) {
            throw this.buildAuthError('Sesi Anda telah berakhir. Silakan login kembali.');
        }

        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                ...fetchOptions,
                headers,
                body: payloadBody
            });

            const rawText = await response.text();
            let parsedBody = null;

            if (rawText) {
                try {
                    parsedBody = JSON.parse(rawText);
                } catch (jsonError) {
                    parsedBody = rawText;
                }
            }

            const data = (parsedBody && typeof parsedBody === 'object' && 'data' in parsedBody)
                ? parsedBody.data
                : parsedBody;

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.handleSessionExpiry();
                }
                const message =
                    (data && data.message) ||
                    (parsedBody && parsedBody.message) ||
                    (typeof parsedBody === 'string' ? parsedBody : null) ||
                    `HTTP error! status: ${response.status}`;
                const error = new Error(message);
                error.status = response.status;
                error.payload = data ?? parsedBody;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            if (error.status === 401 || error.status === 403) {
                this.handleSessionExpiry();
            }
            throw error;
        }
    }

    // ========== USER API ==========
    async login(username, password) {
        return this.request('/user/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    async register(userData) {
        return this.request('/user', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async createUser(userData) {
        return this.request('/user', {
            method: 'POST',
            body: userData
        });
    }

    async getAllUsers() {
        return this.request('/user');
    }

    async getUserById(id) {
        const userId = this.ensureValidId(id, 'ID pengguna');
        return this.request(`/user/${encodeURIComponent(userId)}`);
    }

    async updateUser(id, userData) {
        const userId = this.ensureValidId(id, 'ID pengguna');
        return this.request(`/user/${encodeURIComponent(userId)}`, {
            method: 'PUT',
            body: userData
        });
    }

    async deleteUser(id) {
        const userId = this.ensureValidId(id, 'ID pengguna');
        return this.request(`/user/${encodeURIComponent(userId)}`, {
            method: 'DELETE'
        });
    }

    // ========== REQUEST API ==========
    async getAllRequests() {
        return this.request('/request');
    }

    async getRequestById(id) {
        const requestId = this.ensureValidId(id, 'ID request');
        return this.request(`/request/${encodeURIComponent(requestId)}`);
    }

    async getRequestsByLansiaUserId(userId) {
        const lansiaId = this.ensureValidId(userId, 'ID pengguna lansia');
        return this.request(`/request/lansia/${encodeURIComponent(lansiaId)}`);
    }

    async createRequest(requestData) {
        return this.request('/request', {
            method: 'POST',
            body: requestData
        });
    }

    async updateRequest(id, requestData) {
        const requestId = this.ensureValidId(id, 'ID request');
        return this.request(`/request/${encodeURIComponent(requestId)}`, {
            method: 'PUT',
            body: requestData
        });
    }

    async deleteRequest(id) {
        const requestId = this.ensureValidId(id, 'ID request');
        return this.request(`/request/${encodeURIComponent(requestId)}`, {
            method: 'DELETE'
        });
    }

    // ========== ASSIGNMENT API ==========
    async getAllAssignments() {
        return this.request('/assignments');
    }

    async getAssignmentById(id) {
        const assignmentId = this.ensureValidId(id, 'ID assignment');
        return this.request(`/assignments/${encodeURIComponent(assignmentId)}`);
    }

    async getAssignmentsByRequestId(requestId) {
        const safeRequestId = this.ensureValidId(requestId, 'ID request');
        return this.request(`/assignments/request/${encodeURIComponent(safeRequestId)}`);
    }

    async getAssignmentsByVolunteerId(volunteerId) {
        const safeVolunteerId = this.ensureValidId(volunteerId, 'ID relawan');
        return this.request(`/assignments/user/${encodeURIComponent(safeVolunteerId)}`);
    }

    async createAssignment(assignmentData) {
        if (!assignmentData || typeof assignmentData !== 'object') {
            throw new Error('Data assignment tidak valid.');
        }
        const payload = {
            requestId: this.ensureValidId(assignmentData.requestId, 'ID request'),
            volunteerUserId: this.ensureValidId(assignmentData.volunteerUserId, 'ID relawan')
        };
        return this.request('/assignments', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async acceptAssignment(assignmentId, volunteerUserId) {
        const safeAssignmentId = this.ensureValidId(assignmentId, 'ID assignment');
        const safeVolunteer = this.ensureValidId(volunteerUserId, 'ID relawan');
        return this.request(`/assignments/${encodeURIComponent(safeAssignmentId)}/accept`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId: safeVolunteer })
        });
    }

    async startAssignment(assignmentId, volunteerUserId) {
        const safeAssignmentId = this.ensureValidId(assignmentId, 'ID assignment');
        const safeVolunteer = this.ensureValidId(volunteerUserId, 'ID relawan');
        return this.request(`/assignments/${encodeURIComponent(safeAssignmentId)}/start`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId: safeVolunteer })
        });
    }

    async completeAssignment(assignmentId, volunteerUserId) {
        const safeAssignmentId = this.ensureValidId(assignmentId, 'ID assignment');
        const safeVolunteer = this.ensureValidId(volunteerUserId, 'ID relawan');
        return this.request(`/assignments/${encodeURIComponent(safeAssignmentId)}/complete`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId: safeVolunteer })
        });
    }

    async deleteAssignment(id) {
        const assignmentId = this.ensureValidId(id, 'ID assignment');
        return this.request(`/assignments/${encodeURIComponent(assignmentId)}`, {
            method: 'DELETE'
        });
    }

    // ========== REVIEW API ==========
    async getAllReviews() {
        return this.request('/reviews');
    }

    async getReviewById(id) {
        const reviewId = this.ensureValidId(id, 'ID ulasan');
        return this.request(`/reviews/${encodeURIComponent(reviewId)}`);
    }

    async getReviewsByRequestId(requestId) {
        const safeRequestId = this.ensureValidId(requestId, 'ID request');
        return this.request(`/reviews/request/${encodeURIComponent(safeRequestId)}`);
    }

    async getReviewsByUserId(userId) {
        const safeUserId = this.ensureValidId(userId, 'ID pengguna');
        return this.request(`/reviews/user/${encodeURIComponent(safeUserId)}`);
    }

    async createReview(reviewData) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async updateReview(id, reviewData) {
        const reviewId = this.ensureValidId(id, 'ID ulasan');
        return this.request(`/reviews/${encodeURIComponent(reviewId)}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    async deleteReview(id) {
        const reviewId = this.ensureValidId(id, 'ID ulasan');
        return this.request(`/reviews/${encodeURIComponent(reviewId)}`, {
            method: 'DELETE'
        });
    }
}

// Export instance
const apiService = new ApiService();
