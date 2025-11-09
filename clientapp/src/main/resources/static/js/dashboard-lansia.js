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
    const displayName = currentUser.fullname || currentUser.username || 'Keluarga';
    $('#navbar-user-name').text(displayName);
    $('#lansia-hero-name').text(displayName);
    $('#lansia-hero-email').text(currentUser.email || '-');
    $('#lansia-hero-phone').text(currentUser.phone || '-');

    if ($('#user-table').length) {
        renderProfile(currentUser);
    }

    if ($('#request-form').length || $('#my-requests-body').length) {
        initRequestSection(currentUserId);
    }

    if ($('#review-form').length || $('#my-reviews-body').length) {
        initReviewSection(currentUserId);
    }

    function renderProfile(user) {
        $('#user-table tbody').html(`
            <tr>
                <td>${user.fullname || user.username || '-'}</td>
                <td>${user.email || '-'}</td>
            </tr>
        `);
    }
});

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
            const requests = await apiService.getRequestsByLansiaUserId(currentUserId);
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

    if (!reviewsTable.length && !reviewForm.length) {
        return;
    }

    window.refreshMyReviews = function () {
        loadMyReviews();
    };

    loadMyReviews();

    if (reviewForm.length) {
        reviewForm.on('submit', async function (event) {
            event.preventDefault();
            clearReviewFeedback();

            const requestId = parseInt($('#review-request-id').val(), 10);
            const rating = parseInt($('#review-rating').val(), 10);
            const comment = $('#review-comment').val();

            if (!requestId || !rating) {
                showReviewFeedback('Request ID dan rating wajib diisi.', true);
                return;
            }

            try {
                const assignments = await apiService.getAssignmentsByRequestId(requestId);
                if (!Array.isArray(assignments) || assignments.length === 0) {
                    showReviewFeedback('Tidak ditemukan relawan untuk permintaan tersebut.', true);
                    return;
                }
                const volunteer = assignments[0].volunteer;
                if (!volunteer || !volunteer.userId) {
                    showReviewFeedback('Data relawan tidak lengkap.', true);
                    return;
                }

                await apiService.createReview({
                    requestId,
                    reviewerUserId: currentUserId,
                    revieweeUserId: volunteer.userId,
                    rating,
                    comment
                });
                showReviewFeedback('Terima kasih! Ulasan berhasil dikirim.', false);
                reviewForm[0].reset();
                loadMyReviews();
            } catch (error) {
                showReviewFeedback(error.message || 'Gagal mengirim ulasan.', true);
            }
        });
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
