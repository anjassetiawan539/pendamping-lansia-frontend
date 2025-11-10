// API Service - Wrapper untuk semua API calls
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:9000/api';
        this._sessionExpiredHandled = false;
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
        return this.request(`/user/${id}`);
    }

    async updateUser(id, userData) {
        return this.request(`/user/${id}`, {
            method: 'PUT',
            body: userData
        });
    }

    async deleteUser(id) {
        return this.request(`/user/${id}`, {
            method: 'DELETE'
        });
    }

    // ========== REQUEST API ==========
    async getAllRequests() {
        return this.request('/request');
    }

    async getRequestById(id) {
        return this.request(`/request/${id}`);
    }

    async getRequestsByLansiaUserId(userId) {
        return this.request(`/request/lansia/${userId}`);
    }

    async createRequest(requestData) {
        return this.request('/request', {
            method: 'POST',
            body: requestData
        });
    }

    async updateRequest(id, requestData) {
        return this.request(`/request/${id}`, {
            method: 'PUT',
            body: requestData
        });
    }

    async deleteRequest(id) {
        return this.request(`/request/${id}`, {
            method: 'DELETE'
        });
    }

    // ========== ASSIGNMENT API ==========
    async getAllAssignments() {
        return this.request('/assignments');
    }

    async getAssignmentById(id) {
        return this.request(`/assignments/${id}`);
    }

    async getAssignmentsByRequestId(requestId) {
        return this.request(`/assignments/request/${requestId}`);
    }

    async getAssignmentsByVolunteerId(volunteerId) {
        return this.request(`/assignments/user/${volunteerId}`);
    }

    async createAssignment(assignmentData) {
        return this.request('/assignments', {
            method: 'POST',
            body: JSON.stringify(assignmentData)
        });
    }

    async acceptAssignment(assignmentId, volunteerUserId) {
        return this.request(`/assignments/${assignmentId}/accept`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId })
        });
    }

    async startAssignment(assignmentId, volunteerUserId) {
        return this.request(`/assignments/${assignmentId}/start`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId })
        });
    }

    async completeAssignment(assignmentId, volunteerUserId) {
        return this.request(`/assignments/${assignmentId}/complete`, {
            method: 'POST',
            body: JSON.stringify({ volunteerUserId })
        });
    }

    async deleteAssignment(id) {
        return this.request(`/assignments/${id}`, {
            method: 'DELETE'
        });
    }

    // ========== REVIEW API ==========
    async getAllReviews() {
        return this.request('/reviews');
    }

    async getReviewById(id) {
        return this.request(`/reviews/${id}`);
    }

    async getReviewsByRequestId(requestId) {
        return this.request(`/reviews/request/${requestId}`);
    }

    async getReviewsByUserId(userId) {
        return this.request(`/reviews/user/${userId}`);
    }

    async createReview(reviewData) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async updateReview(id, reviewData) {
        return this.request(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    async deleteReview(id) {
        return this.request(`/reviews/${id}`, {
            method: 'DELETE'
        });
    }
}

// Export instance
const apiService = new ApiService();
