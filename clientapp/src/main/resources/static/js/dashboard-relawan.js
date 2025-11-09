$(document).ready(function () {
    if (typeof requireAuth === 'function' && !requireAuth()) {
        return;
    }

    const currentUser = SessionManager.getUser();
    if (!currentUser || currentUser.role !== 'RELAWAN') {
        alert('Akses ditolak! Halaman ini khusus relawan.');
        logout();
        return;
    }

    const currentUserId = currentUser.userId;
    const displayName = currentUser.fullname || currentUser.username || 'Relawan';
    $('#navbar-user-name').text(displayName);
    $('#relawan-hero-name').text(displayName);
    $('#relawan-hero-email').text(currentUser.email || '-');

    const sections = {
        stats: $('#total-available').length > 0,
        available: $('#available-requests').length > 0,
        tasks: $('#my-tasks-body').length > 0,
        reviews: $('#review-table').length > 0
    };

    if (sections.stats) {
        loadStats();
    }
    if (sections.available) {
        loadAvailableRequests();
    }
    if (sections.tasks) {
        loadMyTasks();
    }
    if (sections.reviews) {
        loadMyReviews();
    }

    window.refreshRelawanData = function () {
        if (sections.stats) {
            loadStats();
        }
        if (sections.available) {
            loadAvailableRequests();
        }
        if (sections.tasks) {
            loadMyTasks();
        }
        if (sections.reviews) {
            loadMyReviews();
        }
    };

    window.refreshAvailableRequests = function () {
        loadAvailableRequests();
    };

    window.refreshRelawanReviews = function () {
        loadMyReviews();
    };

    window.refreshMyTasks = function () {
        loadMyTasks();
    };

    function loadStats() {
        apiService.getAllRequests()
            .then(requests => {
                const available = (requests || []).filter(r => r.status === 'OFFERED');
                $('#total-available').text(available.length);
            })
            .catch(() => $('#total-available').text('-'));

        apiService.getAssignmentsByVolunteerId(currentUserId)
            .then(assignments => {
                const list = assignments || [];
                $('#total-my-tasks').text(list.length);
                const completed = list.filter(a => a.status === 'COMPLETE');
                $('#total-completed').text(completed.length);
            })
            .catch(() => {
                $('#total-my-tasks').text('-');
                $('#total-completed').text('-');
            });
    }

    function loadAvailableRequests() {
        if (!sections.available) {
            return;
        }

        $('#available-requests').html(`
            <div class="col-12 text-center py-4">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);

        apiService.getAllRequests()
            .then(requests => {
                const available = (requests || []).filter(r => r.status === 'OFFERED');
                renderAvailableRequests(available);
            })
            .catch(error => {
                $('#available-requests').html(`
                    <div class="col-12 text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> ${error.message || 'Gagal memuat data'}
                    </div>
                `);
            });
    }

    function renderAvailableRequests(requests) {
        if (!requests.length) {
            $('#available-requests').html(`
                <div class="col-12 text-center text-muted py-4">
                    <i class="bi bi-inbox"></i>
                    <p class="mt-2 mb-0">Belum ada request tersedia.</p>
                </div>
            `);
            return;
        }

        const cards = requests.map(req => {
            const start = req.startTime ? new Date(req.startTime).toLocaleString('id-ID') : '-';
            return `
                <div class="col-md-6 col-xl-4 mb-3">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${req.layanan || 'Request'}</h5>
                                <span class="badge bg-info">${req.status || '-'}</span>
                            </div>
                            <p class="card-text text-muted">${req.deskripsi || 'Tidak ada deskripsi'}</p>
                            <small class="d-block mb-1"><i class="bi bi-clock"></i> ${start}</small>
                            <small class="d-block"><i class="bi bi-hourglass"></i> Durasi ${req.duration || 0} menit</small>
                        </div>
                        <div class="card-footer bg-white border-0">
                            <button class="btn btn-success w-100" onclick="takeRequest(${req.requestId})">
                                <i class="bi bi-hand-thumbs-up"></i> Ambil Request
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        $('#available-requests').html(cards);
    }

    function loadMyTasks() {
        if (!sections.tasks) {
            return;
        }

        $('#my-tasks-body').html(`
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `);

        apiService.getAssignmentsByVolunteerId(currentUserId)
            .then(assignments => renderMyTasks(assignments || []))
            .catch(error => {
                $('#my-tasks-body').html(`
                    <tr>
                        <td colspan="7" class="text-center text-danger">
                            <i class="bi bi-exclamation-triangle"></i> ${error.message || 'Gagal memuat tugas'}
                        </td>
                    </tr>
                `);
            });
    }

    function renderMyTasks(assignments) {
        if (!assignments.length) {
            $('#my-tasks-body').html(`
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="bi bi-inbox"></i> Belum ada tugas
                    </td>
                </tr>
            `);
            return;
        }

        const rows = assignments.map(a => {
            const request = a.request || {};
            const lansia = request.lansia || {};
            const start = request.startTime ? new Date(request.startTime).toLocaleString('id-ID') : '-';
            return `
                <tr>
                    <td>#${a.assignmentId}</td>
                    <td>${request.layanan || '-'}</td>
                    <td>${lansia.fullname || lansia.username || '-'}</td>
                    <td>${start}</td>
                    <td>${request.duration || 0} menit</td>
                    <td>${assignmentStatusBadge(a.status)}</td>
                    <td>${taskButtons(a.status, a.assignmentId)}</td>
                </tr>
            `;
        }).join('');

        $('#my-tasks-body').html(rows);
    }

    function assignmentStatusBadge(status) {
        const map = {
            'SCHEDULED': 'bg-info',
            'ACCEPTED': 'bg-success',
            'IN_PROGRESS': 'bg-primary',
            'COMPLETE': 'bg-secondary',
            'CANCELLED': 'bg-danger'
        };
        const badge = map[status] || 'bg-secondary';
        return `<span class="badge ${badge}">${status || '-'}</span>`;
    }

    function taskButtons(status, assignmentId) {
        if (status === 'SCHEDULED') {
            return `<button class="btn btn-sm btn-success" onclick="acceptTask(${assignmentId})"><i class="bi bi-check-circle"></i> Accept</button>`;
        }
        if (status === 'ACCEPTED') {
            return `<button class="btn btn-sm btn-primary" onclick="startTask(${assignmentId})"><i class="bi bi-play-circle"></i> Start</button>`;
        }
        if (status === 'IN_PROGRESS') {
            return `<button class="btn btn-sm btn-warning" onclick="completeTask(${assignmentId})"><i class="bi bi-check-all"></i> Complete</button>`;
        }
        return '<span class="text-muted">Selesai</span>';
    }

    function loadMyReviews() {
        if (!sections.reviews) {
            return;
        }

        const tbody = $('#review-table tbody');
        tbody.html(`
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `);

        apiService.getReviewsByUserId(currentUserId)
            .then(reviews => {
                if (!reviews || !reviews.length) {
                    tbody.html(`
                        <tr>
                            <td colspan="5" class="text-center text-muted">
                                <i class="bi bi-inbox"></i> Belum ada ulasan
                            </td>
                        </tr>
                    `);
                    return;
                }
                const rows = reviews.map(review => {
                    const stars = '⭐'.repeat(review.rating || 0);
                    const reviewer = review.reviewer || {};
                    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('id-ID') : '-';
                    return `
                        <tr>
                            <td>#${review.requestId || '-'}</td>
                            <td>${stars} (${review.rating || 0})</td>
                            <td>${review.comment || '-'}</td>
                            <td>${reviewer.fullname || reviewer.username || '-'}</td>
                            <td>${date}</td>
                        </tr>
                    `;
                }).join('');
                tbody.html(rows);
            })
            .catch(error => {
                tbody.html(`
                    <tr>
                        <td colspan="5" class="text-center text-danger">
                            <i class="bi bi-exclamation-triangle"></i> ${error.message || 'Gagal memuat ulasan'}
                        </td>
                    </tr>
                `);
            });
    }

    window.takeRequest = function (requestId) {
        if (!confirm('Ambil request ini?')) {
            return;
        }
        apiService.createAssignment({
            requestId,
            volunteerUserId: currentUserId
        })
            .then(() => {
                alert('Request berhasil diambil!');
                refreshRelawanData();
            })
            .catch(error => alert(error.message || 'Gagal mengambil request'));
    };

    window.acceptTask = function (assignmentId) {
        if (!confirm('Terima tugas ini?')) {
            return;
        }
        apiService.acceptAssignment(assignmentId, currentUserId)
            .then(() => {
                alert('Tugas diterima!');
                refreshRelawanData();
            })
            .catch(error => alert(error.message || 'Gagal menerima tugas'));
    };

    window.startTask = function (assignmentId) {
        if (!confirm('Mulai tugas?')) {
            return;
        }
        apiService.startAssignment(assignmentId, currentUserId)
            .then(() => {
                alert('Tugas dimulai!');
                refreshRelawanData();
            })
            .catch(error => alert(error.message || 'Gagal memulai tugas'));
    };

    window.completeTask = function (assignmentId) {
        if (!confirm('Tandai tugas sebagai selesai?')) {
            return;
        }
        apiService.completeAssignment(assignmentId, currentUserId)
            .then(() => {
                alert('Terima kasih! Tugas selesai.');
                refreshRelawanData();
            })
            .catch(error => alert(error.message || 'Gagal menyelesaikan tugas'));
    };
});
