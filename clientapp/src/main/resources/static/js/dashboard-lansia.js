$(document).ready(function () {
    if (typeof requireAuth === 'function' && !requireAuth()) {
        return;
    }

    const allowedRoles = ['LANSIA', 'KELUARGA'];
    const currentUser = SessionManager.getUser();
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        alert('Akses ditolak! Hanya lansia/keluarga yang bisa mengakses halaman ini.');
        logout();
        return;
    }

    const currentUserId = currentUser.userId;
    hydrateProfile();
    if ($('#lansia-stats-wrapper').length) {
        hydrateDashboardStats(currentUserId);
    }

    if ($('#request-form').length || $('#my-requests-body').length) {
        initRequestSection(currentUserId);
    }

    if ($('#review-form').length || $('#my-reviews-body').length) {
        initReviewSection(currentUserId);
    }

    async function hydrateProfile() {
        updateProfileUI(currentUser);
        try {
            const freshProfile = await apiService.getUserById(currentUserId);
            if (freshProfile) {
                const merged = { ...currentUser, ...freshProfile };
                SessionManager.setUser({ ...merged, role: currentUser.role });
                updateProfileUI(merged);
            }
        } catch (error) {
            console.warn('Gagal memuat profil lengkap:', error);
        }
    }

    function updateProfileUI(userData) {
        const name = getDisplayName(userData);
        $('#navbar-user-name').text(name);
        $('#lansia-hero-name').text(name);
        $('#lansia-hero-email').text(userData.email || '-');
        $('#lansia-hero-phone').text(formatPhone(userData.phone));
        populateProfileModal(userData);
    }

    function populateProfileModal(user = {}) {
        $('#profile-modal-username').text(escapeHtml(user.username));
        $('#profile-modal-fullname').text(escapeHtml(user.fullname));
        $('#profile-modal-email').text(escapeHtml(user.email));
        $('#profile-modal-phone').text(escapeHtml(formatPhone(user.phone)));
        $('#profile-modal-province').text(escapeHtml(user.province));
        $('#profile-modal-city').text(escapeHtml(user.city));
        $('#profile-modal-address').text(escapeHtml(user.addressDetail));
        $('#profile-modal-bio').text(escapeHtml(user.bio));
    }

    async function hydrateDashboardStats(userId) {
        try {
            const requests = await fetchRequestsForLansia(userId);
            updateStatsUI(requests || []);
        } catch (error) {
            console.error('Gagal memuat statistik request:', error);
            updateStatsUI([]);
        }
    }

    function updateStatsUI(requests) {
        const counters = {
            requested: 0,
            assigned: 0,
            progress: 0,
            completed: 0
        };

        requests.forEach((req) => {
            const status = (req.status || '').toUpperCase();
            switch (status) {
                case 'OFFERED':
                    counters.requested += 1;
                    break;
                case 'ASSIGNED':
                    counters.assigned += 1;
                    break;
                case 'ON_GOING':
                    counters.progress += 1;
                    break;
                case 'DONE':
                    counters.completed += 1;
                    break;
                default:
                    break;
            }
        });

        $('#stat-requested').text(counters.requested);
        $('#stat-assigned').text(counters.assigned);
        $('#stat-progress').text(counters.progress);
        $('#stat-completed').text(counters.completed);
    }
});

function formatPhone(value) {
    if (!value) {
        return '-';
    }
    const trimmed = value.toString().trim();
    if (!trimmed) {
        return '-';
    }
    if (trimmed.startsWith('0')) {
        return `+62${trimmed.substring(1)}`;
    }
    if (trimmed.startsWith('+') || trimmed.startsWith('62')) {
        return trimmed;
    }
    return trimmed;
}

function getDisplayName(user) {
    if (user && typeof user.fullname === 'string' && user.fullname.trim().length > 0) {
        return user.fullname.trim();
    }
    if (user && typeof user.username === 'string') {
        const trimmed = user.username.trim();
        if (trimmed.length > 0 && !trimmed.includes('@')) {
            return trimmed;
        }
    }
    return 'Keluarga';
}

function escapeHtml(value) {
    if (value === undefined || value === null) {
        return '-';
    }
    return value
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function fetchRequestsForLansia(userId) {
    if (!userId) {
        return [];
    }
    try {
        const direct = await apiService.getRequestsByLansiaUserId(userId);
        return normalizeRequestList(direct);
    } catch (error) {
        console.warn('Endpoint khusus lansia tidak tersedia, fallback ke request umum:', error);
    }

    try {
        const allRequests = await apiService.getAllRequests();
        return normalizeRequestList(allRequests).filter(req => getRequestLansiaId(req) === userId);
    } catch (fallbackError) {
        console.error('Gagal memuat request dari endpoint umum:', fallbackError);
        throw fallbackError;
    }
}

function normalizeRequestList(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (payload && Array.isArray(payload.data)) {
        return payload.data;
    }
    if (payload && Array.isArray(payload.content)) {
        return payload.content;
    }
    return [];
}

function getRequestLansiaId(request) {
    if (!request) {
        return null;
    }
    if (typeof request.lansiaUserId === 'number') {
        return request.lansiaUserId;
    }
    if (request.lansia && typeof request.lansia.userId === 'number') {
        return request.lansia.userId;
    }
    if (request.lansiaUser && typeof request.lansiaUser.userId === 'number') {
        return request.lansiaUser.userId;
    }
    return null;
}

function initRequestSection(currentUserId) {
    const hasRequestsTable = $('#my-requests-body').length > 0;
    const requestForm = $('#request-form');

    if (!hasRequestsTable && !requestForm.length) {
        return;
    }

    if (requestForm.length) {
        attachCreateModeHandler();
    }

    window.refreshMyRequests = function () {
        loadMyRequests();
    };

    loadMyRequests();

    function attachCreateModeHandler() {
        requestForm.off('submit').on('submit', async function (event) {
            event.preventDefault();
            clearRequestFeedback();

            const payload = getRequestPayload();
            if (!payload) {
                showRequestFeedback('Semua field harus diisi!', true);
                return;
            }

            try {
                await apiService.createRequest(payload);
                showRequestFeedback('Permintaan berhasil dibuat!', false);
                requestForm[0].reset();
                loadMyRequests();
            } catch (error) {
                showRequestFeedback(error.message || 'Gagal membuat permintaan.', true);
            }
        });
    }

    function getRequestPayload() {
        const layanan = $('#request-layanan').val();
        const deskripsi = $('#request-deskripsi').val();
        const startTimeValue = $('#request-start-time').val();
        const duration = parseInt($('#request-duration').val(), 10);

        if (!layanan || !deskripsi || !startTimeValue || !duration) {
            return null;
        }

        return {
            lansiaUserId: currentUserId,
            layanan,
            deskripsi,
            startTime: `${startTimeValue}:00`,
            duration
        };
    }

    function clearRequestFeedback() {
        $('#request-feedback')
            .addClass('d-none')
            .removeClass('alert alert-success alert-danger')
            .text('');
    }

    function showRequestFeedback(message, isError) {
        $('#request-feedback')
            .removeClass('d-none alert-success alert-danger')
            .addClass(isError ? 'alert alert-danger' : 'alert alert-success')
            .text(message);

        if (!isError) {
            setTimeout(() => $('#request-feedback').addClass('d-none'), 4500);
        }
    }

    async function loadMyRequests() {
        if (!hasRequestsTable) {
            return;
        }

        $('#my-requests-body').html(`
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `);

        try {
            const requests = await fetchRequestsForLansia(currentUserId);
            await renderRequests(requests || []);
        } catch (error) {
            $('#my-requests-body').html(`
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <i class="bi bi-exclamation-triangle"></i> ${error.message || 'Gagal memuat data'}
                    </td>
                </tr>
            `);
        }
    }



    async function renderRequests(requests) {
        if (!requests.length) {
            $('#my-requests-body').html(`
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        <i class="bi bi-inbox"></i> Belum ada permintaan
                    </td>
                </tr>
            `);
            return;
        }

        const dataWithVolunteer = await Promise.all(requests.map(async (req) => {
            if (req.status === 'OFFERED') {
                return { ...req, volunteerInfo: '<span class="text-muted">-</span>' };
            }

            try {
                const assignments = await apiService.getAssignmentsByRequestId(req.requestId);
                if (assignments && assignments.length > 0 && assignments[0].volunteer) {
                    const volunteer = assignments[0].volunteer;
                    return {
                        ...req,
                        volunteerInfo: `<span class="badge bg-success">${volunteer.fullname || volunteer.username}</span>`
                    };
                }
            } catch (error) {
                console.error('Gagal load volunteer', error);
            }

            return { ...req, volunteerInfo: '<span class="text-muted">-</span>' };
        }));

        const rows = dataWithVolunteer.map((req) => {
            const startTime = req.startTime ? new Date(req.startTime).toLocaleString('id-ID') : '-';
            return `
                <tr>
                    <td>#${req.requestId}</td>
                    <td>${req.layanan || '-'}</td>
                    <td>${req.deskripsi || '-'}</td>
                    <td>${startTime}</td>
                    <td>${req.duration || 0} menit</td>
                    <td>${getStatusBadge(req.status)}</td>
                    <td>${req.volunteerInfo}</td>
                    <td>
                        <button class="btn btn-sm btn-warning mb-1" onclick="editRequest(${req.requestId})" ${req.status !== 'OFFERED' ? 'disabled' : ''}>
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRequest(${req.requestId})" ${req.status !== 'OFFERED' ? 'disabled' : ''}>
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        $('#my-requests-body').html(rows);
    }

    function getStatusBadge(status) {
        const badges = {
            'OFFERED': 'bg-info',
            'ASSIGNED': 'bg-warning',
            'ON_GOING': 'bg-primary',
            'DONE': 'bg-success',
            'CANCELLED': 'bg-danger'
        };
        const badgeClass = badges[status] || 'bg-secondary';
        const label = status ? status.replace('_', ' ') : 'UNKNOWN';
        return `<span class="badge ${badgeClass}">${label}</span>`;
    }

    window.editRequest = async function (requestId) {
        if (!requestForm.length) {
            return;
        }
        try {
            const request = await apiService.getRequestById(requestId);
            $('#request-layanan').val(request.layanan);
            $('#request-deskripsi').val(request.deskripsi);
            if (request.startTime) {
                const date = new Date(request.startTime);
                $('#request-start-time').val(date.toISOString().slice(0, 16));
            }
            $('#request-duration').val(request.duration);

            requestForm.off('submit').on('submit', async function (event) {
                event.preventDefault();
                clearRequestFeedback();

                const payload = getRequestPayload();
                if (!payload) {
                    showRequestFeedback('Semua field harus diisi!', true);
                    return;
                }
                try {
                    await apiService.updateRequest(requestId, payload);
                    showRequestFeedback('Permintaan berhasil diupdate!', false);
                    requestForm[0].reset();
                    loadMyRequests();
                    attachCreateModeHandler();
                } catch (error) {
                    showRequestFeedback(error.message || 'Gagal update permintaan.', true);
                }
            });

            $('html, body').animate({
                scrollTop: requestForm.offset().top - 100
            }, 400);
            showRequestFeedback('Mode edit diaktifkan. Silakan perbarui data.', false);
        } catch (error) {
            alert('Gagal memuat data request: ' + (error.message || 'Terjadi kesalahan'));
        }
    };

    window.deleteRequest = async function (requestId) {
        if (!confirm('Yakin ingin menghapus permintaan ini?')) {
            return;
        }
        try {
            await apiService.deleteRequest(requestId);
            loadMyRequests();
            alert('Permintaan berhasil dihapus.');
        } catch (error) {
            alert('Gagal menghapus permintaan: ' + (error.message || 'Terjadi kesalahan'));
        }
    };
}

function initReviewSection(currentUserId) {
    const reviewsTable = $('#my-reviews-body');
    const reviewForm = $('#review-form');
    const reviewSelect = $('#review-assignment-select');
    let reviewOptions = [];

    if (!reviewsTable.length && !reviewForm.length) {
        return;
    }

    window.refreshMyReviews = function () {
        loadMyReviews();
    };

    loadMyReviews();
    if (reviewSelect.length) {
        hydrateReviewOptions();
    }

    if (reviewForm.length) {
        reviewForm.on('submit', async function (event) {
            event.preventDefault();
            clearReviewFeedback();

            const selectedIndex = parseInt(reviewSelect.val(), 10);
            const rating = parseInt($('#review-rating').val(), 10);
            const comment = $('#review-comment').val();

            if (Number.isNaN(selectedIndex) || !reviewOptions[selectedIndex]) {
                showReviewFeedback('Pilih relawan terlebih dahulu.', true);
                return;
            }
            if (!rating || rating < 1 || rating > 5) {
                showReviewFeedback('Rating wajib antara 1-5.', true);
                return;
            }

            const choice = reviewOptions[selectedIndex];

            try {
                await apiService.createReview({
                    requestId: choice.requestId,
                    reviewerUserId: currentUserId,
                    revieweeUserId: choice.volunteerUserId,
                    rating,
                    comment
                });
                showReviewFeedback('Terima kasih! Ulasan berhasil dikirim.', false);
                reviewForm[0].reset();
                hydrateReviewOptions();
                loadMyReviews();
            } catch (error) {
                showReviewFeedback(error.message || 'Gagal mengirim ulasan.', true);
            }
        });
    }

    async function hydrateReviewOptions() {
        if (!reviewSelect.length) {
            return;
        }
        reviewSelect.prop('disabled', true).html('<option value=\"\">Memuat data...</option>');

        try {
            const requests = await fetchRequestsForLansia(currentUserId);
            const completed = (requests || []).filter(req => (req.status || '').toUpperCase() === 'DONE');
            reviewOptions = [];

            for (const req of completed) {
                try {
                    const assignments = await apiService.getAssignmentsByRequestId(req.requestId);
                    const assignment = (assignments || [])[0];
                    if (assignment && assignment.volunteer) {
                        reviewOptions.push({
                            requestId: req.requestId,
                            layanan: req.layanan,
                            volunteerUserId: assignment.volunteer.userId,
                            volunteerName: assignment.volunteer.fullname || assignment.volunteer.username || `Relawan #${assignment.volunteer.userId}`
                        });
                    }
                } catch (error) {
                    console.warn('Gagal memuat assignment untuk request', req.requestId, error);
                }
            }

            if (!reviewOptions.length) {
                reviewSelect.html('<option value=\"\">Belum ada layanan selesai</option>');
                return;
            }

            const optionsHtml = reviewOptions.map((opt, idx) =>
                `<option value=\"${idx}\">${escapeHtml(opt.volunteerName)} - ${escapeHtml(opt.layanan || '-') } (#${opt.requestId})</option>`
            ).join('');
            reviewSelect.html('<option value=\"\">Pilih relawan...</option>' + optionsHtml);
            reviewSelect.prop('disabled', false);
        } catch (error) {
            console.error('Gagal menyiapkan opsi ulasan:', error);
            reviewSelect.html('<option value=\"\">Gagal memuat data</option>');
        }
    }

    async function loadMyReviews() {
        if (!reviewsTable.length) {
            return;
        }

        reviewsTable.html(`
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `);

        try {
            const reviews = await apiService.getReviewsByUserId(currentUserId);
            const mine = (reviews || []).filter(r => r.reviewer && r.reviewer.userId === currentUserId);
            if (!mine.length) {
                reviewsTable.html(`
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            <i class="bi bi-inbox"></i> Belum ada ulasan
                        </td>
                    </tr>
                `);
                return;
            }

            const rows = mine.map(review => {
                const stars = '⭐'.repeat(review.rating || 0);
                const createdDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('id-ID') : '-';
                const reviewee = review.reviewee || {};
                return `
                    <tr>
                        <td>#${review.request?.requestId || '-'}</td>
                        <td>${reviewee.fullname || reviewee.username || '-'}</td>
                        <td>${stars} (${review.rating || 0})</td>
                        <td>${review.comment || '-'}</td>
                        <td>${createdDate}</td>
                    </tr>
                `;
            }).join('');
            reviewsTable.html(rows);
        } catch (error) {
            reviewsTable.html(`
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        <i class="bi bi-exclamation-triangle"></i> ${error.message || 'Gagal memuat ulasan'}
                    </td>
                </tr>
            `);
        }
    }

    function clearReviewFeedback() {
        $('#review-feedback')
            .addClass('d-none')
            .removeClass('alert alert-success alert-danger')
            .text('');
    }

    function showReviewFeedback(message, isError) {
        $('#review-feedback')
            .removeClass('d-none alert-success alert-danger')
            .addClass(isError ? 'alert alert-danger' : 'alert alert-success')
            .text(message);
    }
}
