// Dashboard Admin JS
$(document).ready(function() {
    // Check authentication
    if (!requireAuth()) {
        return;
    }

    // Check if user is admin
    const currentUser = SessionManager.getUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Akses ditolak! Hanya admin yang bisa mengakses halaman ini.');
        window.location.href = '/login';
        return;
    }

    // Display admin name
    const displayName = currentUser.fullname || currentUser.username || 'Admin';
    $('#admin-name').text(displayName);
    $('#navbar-user-name').text(displayName);

    // Load dashboard data
    loadStats();
    loadUsers();
    $('#user-search').on('input', function() {
        applySearchFilter($(this).val());
    });

    let cachedUsers = [];
    let sessionExpired = false;

    // Load statistics
    function loadStats() {
        // Load total users
        apiService.getAllUsers()
            .then(users => {
                $('#total-users').text(users.length);
                
                // Count volunteers
                const volunteers = users.filter(u => u.role === 'RELAWAN');
                $('#total-volunteers').text(volunteers.length);
            })
            .catch(error => {
                console.error('Error loading users stats:', error);
                if (handleUnauthorized(error)) {
                    return;
                }
            });

        // Load total requests
        apiService.getAllRequests()
            .then(requests => {
                $('#total-requests').text(requests.length);
                
                // Count completed requests
                const completed = requests.filter(r => r.status === 'DONE');
                $('#total-completed').text(completed.length);
            })
            .catch(error => {
                console.error('Error loading requests stats:', error);
                if (handleUnauthorized(error)) {
                    return;
                }
                $('#total-requests').text('-');
                $('#total-completed').text('-');
            });
    }

    // Load all users
    function loadUsers() {
        apiService.getAllUsers()
            .then(users => {
                cachedUsers = users || [];
                renderUsers(cachedUsers);
                applySearchFilter($('#user-search').val());
            })
            .catch(error => {
                console.error('Error loading users:', error);
                if (handleUnauthorized(error)) {
                    return;
                }
                renderUserError(`Gagal memuat data: ${error.message || 'Terjadi kesalahan'}`);
            });
    }

    // Render users table
    function renderUsers(users, options = {}) {
        const emptyMessage = options.emptyMessage || '<i class="bi bi-inbox"></i> Tidak ada data pengguna';
        if (!users || users.length === 0) {
            $('#user-table-body').html(`
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        ${emptyMessage}
                    </td>
                </tr>
            `);
            return;
        }

        const html = users.map(user => {
            const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-';
            
            return `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.fullname || '-'}</td>
                    <td>${user.phone || '-'}</td>
                    <td><span class="badge bg-${getRoleBadgeColor(user.role)}">${user.role}</span></td>
                    <td>${createdDate}</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-secondary" onclick="viewUserDetail(${user.userId})" title="Detail">
                                <i class="bi bi-eye"></i>
                            </button>
                            ${user.role !== 'ADMIN' ? `
                            <button class="btn btn-outline-danger" onclick="deleteUser(${user.userId}, '${user.username}')" title="Hapus">
                                <i class="bi bi-trash"></i>
                            </button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        $('#user-table-body').html(html);
    }

    function applySearchFilter(keyword) {
        const term = (keyword || '').trim().toLowerCase();
        if (!term) {
            renderUsers(cachedUsers);
            return;
        }
        const filtered = cachedUsers.filter(user => {
            const values = [
                user.username,
                user.email,
                user.fullname,
                user.phone,
                user.role
            ].filter(Boolean).map(val => val.toString().toLowerCase());
            return values.some(val => val.includes(term));
        });
        renderUsers(filtered, { emptyMessage: '<i class="bi bi-search"></i> Tidak ada data yang cocok' });
    }

    // Get badge color based on role
    function getRoleBadgeColor(role) {
        const colors = {
            'ADMIN': 'danger',
            'LANSIA': 'primary',
            'KELUARGA': 'primary',
            'RELAWAN': 'success'
        };
        return colors[role] || 'secondary';
    }

    // Add user (submit)
    window.submitAddUser = async function() {
        const userData = {
            username: $('#add-username').val(),
            email: $('#add-email').val(),
            password: $('#add-password').val(),
            fullname: $('#add-fullname').val(),
            phone: $('#add-phone').val() || null,
            role: $('#add-role').val()
        };

        // Validation
        if (!userData.username || !userData.email || !userData.password || !userData.fullname || !userData.role) {
            alert('Field yang wajib harus diisi!');
            return;
        }

        try {
            await apiService.createUser(userData);
            alert('User berhasil ditambahkan!');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
            
            // Reset form
            $('#addUserForm')[0].reset();
            
            // Reload data
            loadUsers();
            loadStats();
        } catch (error) {
            console.error('Error adding user:', error);
            if (handleUnauthorized(error)) {
                return;
            }
            alert('Gagal menambah user: ' + (error.message || 'Terjadi kesalahan'));
        }
    };

    // View user detail & edit
    window.viewUserDetail = function(userId) {
        apiService.getUserById(userId)
            .then(user => {
                // Populate edit form
                $('#edit-user-id').val(user.userId);
                $('#edit-username').val(user.username);
                $('#edit-email').val(user.email);
                $('#edit-fullname').val(user.fullname || '');
                $('#edit-phone').val(user.phone || '');
                $('#edit-province').val(user.province || '');
                $('#edit-city').val(user.city || '');
                
                // Show edit modal
                const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
                modal.show();
            })
            .catch(error => {
                if (handleUnauthorized(error)) {
                    return;
                }
                alert('Gagal memuat detail user: ' + (error.message || 'Terjadi kesalahan'));
            });
    };

    // Edit user (submit)
    window.submitEditUser = async function() {
        const userId = $('#edit-user-id').val();
        const updateData = {
            email: $('#edit-email').val(),
            fullname: $('#edit-fullname').val(),
            phone: $('#edit-phone').val() || null,
            province: $('#edit-province').val() || null,
            city: $('#edit-city').val() || null
        };

        try {
            await apiService.updateUser(userId, updateData);
            alert('User berhasil diupdate!');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            
            // Reload data
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            if (handleUnauthorized(error)) {
                return;
            }
            alert('Gagal update user: ' + (error.message || 'Terjadi kesalahan'));
        }
    };

    // Delete user
    window.deleteUser = function(userId, username) {
        if (!confirm(`Yakin ingin menghapus user "${username}"?\n\nData yang terhapus tidak dapat dikembalikan!`)) {
            return;
        }

        apiService.deleteUser(userId)
            .then(() => {
                alert('User berhasil dihapus!');
                loadUsers();
                loadStats();
            })
            .catch(error => {
                if (handleUnauthorized(error)) {
                    return;
                }
                alert('Gagal menghapus user: ' + (error.message || 'Terjadi kesalahan'));
            });
    };

    // Refresh button handler
    window.refreshDashboard = function() {
        loadStats();
        loadUsers();
    };

    function handleUnauthorized(error) {
        if (sessionExpired) {
            return true;
        }
        const status = error && error.status;
        const message = error && error.message ? error.message.toLowerCase() : '';
        const unauthorized = status === 401 || status === 403 ||
            (typeof message === 'string' && (message.includes('unauthorized') || message.includes('forbidden')));

        if (unauthorized) {
            sessionExpired = true;
            alert('Sesi Anda telah berakhir. Silakan login kembali.');
            logout();
            return true;
        }
        return false;
    }

    function renderUserError(message) {
        $('#user-table-body').html(`
            <tr>
                <td colspan="8" class="text-center text-danger fw-semibold">
                    <span id="user-table-error-text"></span>
                </td>
            </tr>
        `);
        $('#user-table-error-text').text(message);
    }
});
