# Data Dummy - Teman Lansia Platform


## 📋 Table of Contents

1. [Users Data](#users-data)
2. [Request/Service Data](#requestservice-data)
3. [Review/Rating Data](#reviewrating-data)
4. [Testing Credentials](#testing-credentials)
5. [API Endpoints Collection](#api-endpoints-collection)

---

## 👥 Users Data

### **Admin Account**
```json
{
  "userId": 1,
  "username": "admin",
  "email": "admin@temanlansia.com",
  "password": "admin123",
  "fullname": "Administrator",
  "phone": "081234567890",
  "role": "ADMIN",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Malioboro No. 1",
  "bio": "Administrator sistem Teman Lansia",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### **Lansia (Elderly) Accounts**

#### 1. Siti Aminah
```json
{
  "userId": 2,
  "username": "sitiaminah",
  "email": "siti.aminah@example.com",
  "password": "password123",
  "fullname": "Siti Aminah",
  "phone": "081234567891",
  "role": "LANSIA",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Malioboro No. 10",
  "bio": "Ibu rumah tangga, butuh bantuan untuk aktivitas sehari-hari",
  "createdAt": "2025-01-02T08:00:00Z"
}
```

#### 2. Pak Budi Santoso
```json
{
  "userId": 3,
  "username": "budisantoso",
  "email": "budi.santoso@example.com",
  "password": "password123",
  "fullname": "Budi Santoso",
  "phone": "081234567892",
  "role": "LANSIA",
  "city": "Sleman",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Kaliurang KM 5",
  "bio": "Pensiunan guru, sering memerlukan bantuan medis",
  "createdAt": "2025-01-03T09:00:00Z"
}

#### 3. Ibu Sri Wahyuni
```json
{
  "userId": 4,
  "username": "sriwahyuni",
  "email": "sri.wahyuni@example.com",
  "password": "password123",
  "fullname": "Sri Wahyuni",
  "phone": "081234567893",
  "role": "LANSIA",
  "city": "Bantul",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Parangtritis KM 3",
  "bio": "Janda, tinggal sendiri, butuh teman ngobrol",
  "createdAt": "2025-01-04T10:00:00Z"
}
```

### **Relawan (Volunteer) Accounts**

#### 1. Ahmad Rizki
```json
{
  "userId": 5,
  "username": "ahmadrizki",
  "email": "ahmad.rizki@example.com",
  "password": "password123",
  "fullname": "Ahmad Rizki",
  "phone": "081345678901",
  "role": "RELAWAN",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Affandi No. 20",
  "bio": "Mahasiswa kedokteran, siap membantu lansia dengan kebutuhan medis",
  "createdAt": "2025-01-05T08:00:00Z"
}
```

#### 2. Dewi Lestari
```json
{
  "userId": 6,
  "username": "dewilestari",
  "email": "dewi.lestari@example.com",
  "password": "password123",
  "fullname": "Dewi Lestari",
  "phone": "081345678902",
  "role": "RELAWAN",
  "city": "Sleman",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Seturan Raya",
  "bio": "Pekerja sosial, berpengalaman menemani lansia",
  "createdAt": "2025-01-06T09:00:00Z"
}
```

#### 3. Fajar Nugroho
```json
{
  "userId": 7,
  "username": "fajarnugroho",
  "email": "fajar.nugroho@example.com",
  "password": "password123",
  "fullname": "Fajar Nugroho",
  "phone": "081345678903",
  "role": "RELAWAN",
  "city": "Bantul",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Imogiri Timur",
  "bio": "Freelancer, waktu fleksibel untuk membantu lansia",
  "createdAt": "2025-01-07T10:00:00Z"
}
```

---

## 🆘 Request/Service Data

### **Request 1: Bantuan ke Rumah Sakit**
```json
{
  "requestId": 1,
  "lansia": {
    "userId": 2,
    "fullname": "Siti Aminah"
  },
  "layanan": "Bantuan Medis",
  "deskripsi": "Butuh bantuan untuk pergi ke RS Sardjito untuk check-up rutin diabetes",
  "startTime": "2025-12-20T09:00:00",
  "duration": 120,
  "status": "OFFERED",
  "createdAt": "2025-11-14T08:00:00Z"
}
```

### **Request 2: Belanja Kebutuhan Harian**
```json
{
  "requestId": 2,
  "lansia": {
    "userId": 3,
    "fullname": "Budi Santoso"
  },
  "layanan": "Belanja",
  "deskripsi": "Butuh bantuan belanja kebutuhan harian di pasar tradisional",
  "startTime": "2025-12-21T08:00:00",
  "duration": 90,
  "status": "ASSIGNED",
  "acceptedAt": "2025-11-14T10:00:00Z",
  "createdAt": "2025-11-14T09:00:00Z"
}
```

### **Request 3: Teman Ngobrol**
```json
{
  "requestId": 3,
  "lansia": {
    "userId": 4,
    "fullname": "Sri Wahyuni"
  },
  "layanan": "Teman Ngobrol",
  "deskripsi": "Butuh teman untuk ngobrol dan menemani di rumah",
  "startTime": "2025-12-22T14:00:00",
  "duration": 60,
  "status": "ON_GOING",
  "acceptedAt": "2025-11-14T11:00:00Z",
  "startedAt": "2025-11-14T14:00:00Z",
  "createdAt": "2025-11-14T10:00:00Z"
}
```

### **Request 4: Antar ke Tempat Ibadah**
```json
{
  "requestId": 4,
  "lansia": {
    "userId": 2,
    "fullname": "Siti Aminah"
  },
  "layanan": "Antar Jemput",
  "deskripsi": "Butuh diantar ke masjid untuk sholat Jumat",
  "startTime": "2025-12-23T11:30:00",
  "duration": 45,
  "status": "DONE",
  "acceptedAt": "2025-11-13T08:00:00Z",
  "startedAt": "2025-11-13T11:30:00Z",
  "completedAt": "2025-11-13T12:15:00Z",
  "createdAt": "2025-11-13T07:00:00Z"
}
```

### **Request 5: Pemeriksaan Kesehatan**
```json
{
  "requestId": 5,
  "lansia": {
    "userId": 3,
    "fullname": "Budi Santoso"
  },
  "layanan": "Bantuan Medis",
  "deskripsi": "Perlu diantar ke puskesmas untuk cek tekanan darah rutin",
  "startTime": "2025-12-24T08:00:00",
  "duration": 60,
  "status": "CANCELLED",
  "createdAt": "2025-11-14T07:00:00Z"
}
```

---

## ⭐ Review/Rating Data

### **Review 1: Ahmad Rizki**
```json
{
  "reviewId": 1,
  "requestId": 4,
  "volunteer": {
    "userId": 5,
    "fullname": "Ahmad Rizki"
  },
  "reviewer": {
    "userId": 2,
    "fullname": "Siti Aminah"
  },
  "rating": 5,
  "comment": "Mas Ahmad sangat membantu dan ramah. Pelayanan sangat memuaskan. Terima kasih banyak!",
  "tags": ["HELPFUL", "PUNCTUAL", "FRIENDLY"],
  "createdAt": "2025-11-13T13:00:00Z"
}
```

### **Review 2: Dewi Lestari**
```json
{
  "reviewId": 2,
  "requestId": 2,
  "volunteer": {
    "userId": 6,
    "fullname": "Dewi Lestari"
  },
  "reviewer": {
    "userId": 3,
    "fullname": "Budi Santoso"
  },
  "rating": 5,
  "comment": "Mbak Dewi sangat sabar dan teliti dalam memilih barang belanjaan. Highly recommended!",
  "tags": ["HELPFUL", "CAREFUL", "FRIENDLY"],
  "createdAt": "2025-11-14T12:00:00Z"
}
```

### **Review 3: Fajar Nugroho**
```json
{
  "reviewId": 3,
  "requestId": 3,
  "volunteer": {
    "userId": 7,
    "fullname": "Fajar Nugroho"
  },
  "reviewer": {
    "userId": 4,
    "fullname": "Sri Wahyuni"
  },
  "rating": 4,
  "comment": "Mas Fajar baik dan pendengar yang baik. Saya merasa lebih baik setelah ngobrol dengannya.",
  "tags": ["FRIENDLY", "GOOD_LISTENER"],
  "createdAt": "2025-11-14T15:30:00Z"
}
```

---

## 🔐 Testing Credentials

### **For Postman Testing:**

| Role | Username | Password | User ID |
|------|----------|----------|---------|
| **Admin** | `admin` | `admin123` | 1 |
| **Lansia 1** | `sitiaminah` | `password123` | 2 |
| **Lansia 2** | `budisantoso` | `password123` | 3 |
| **Lansia 3** | `sriwahyuni` | `password123` | 4 |
| **Relawan 1** | `ahmadrizki` | `password123` | 5 |
| **Relawan 2** | `dewilestari` | `password123` | 6 |
| **Relawan 3** | `fajarnugroho` | `password123` | 7 |

---

## 📡 API Endpoints Collection

### **Base URL**
```
http://localhost:9000/api
```

### **1. Authentication**

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin1234"
}
```

#### Register Lansia
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newlansia",
  "email": "newlansia@example.com",
  "password": "password123",
  "fullname": "New Lansia User",
  "phone": "081234567899",
  "role": "LANSIA",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Example No. 1"
}
```

#### Register Relawan
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newrelawan",
  "email": "newrelawan@example.com",
  "password": "password123",
  "fullname": "New Relawan User",
  "phone": "081345678999",
  "role": "RELAWAN",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "Jl. Example No. 2"
}
```

---

### **2. Users Management**

#### Get All Users (Admin)
```http
GET /api/users
Authorization: Bearer {admin_token}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update User Profile
```http
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullname": "Updated Name",
  "phone": "081234567899",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "addressDetail": "New Address"
}
```

#### Get Volunteers
```http
GET /api/users/volunteers
Authorization: Bearer {token}
```

#### Get Elderly Users
```http
GET /api/users/elderly
Authorization: Bearer {token}
```

---

### **3. Service Requests**

#### Create Request (Lansia)
```http
POST /api/requests
Authorization: Bearer {lansia_token}
Content-Type: application/json

{
  "layanan": "Belanja",
  "deskripsi": "Butuh bantuan belanja kebutuhan harian",
  "startTime": "2025-12-25T07:30:00",
  "duration": 60
}
```

#### Get All Requests
```http
GET /api/requests
Authorization: Bearer {token}
```

#### Get Request by ID
```http
GET /api/requests/{requestId}
Authorization: Bearer {token}
```

#### Get My Requests
```http
GET /api/requests/my-requests
Authorization: Bearer {token}
```

#### Update Request
```http
PUT /api/requests/{requestId}
Authorization: Bearer {lansia_token}
Content-Type: application/json

{
  "layanan": "Belanja Updated",
  "deskripsi": "Update deskripsi",
  "startTime": "2025-12-26T08:00:00",
  "duration": 90
}
```

#### Accept Request (Volunteer)
```http
PUT /api/requests/{requestId}/accept
Authorization: Bearer {volunteer_token}
```

#### Start Request
```http
PUT /api/requests/{requestId}/start
Authorization: Bearer {volunteer_token}
```

#### Complete Request
```http
PUT /api/requests/{requestId}/complete
Authorization: Bearer {volunteer_token}
```

#### Cancel Request
```http
PUT /api/requests/{requestId}/cancel
Authorization: Bearer {lansia_token}
```

#### Delete Request
```http
DELETE /api/requests/{requestId}
Authorization: Bearer {lansia_token}
```

---

### **4. Reviews & Ratings**

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {lansia_token}
Content-Type: application/json

{
  "requestId": 1,
  "volunteerId": 5,
  "rating": 5,
  "comment": "Relawan sangat membantu dan ramah!",
  "tags": ["HELPFUL", "PUNCTUAL", "FRIENDLY"]
}
```

#### Get Volunteer Reviews
```http
GET /api/reviews/volunteer/{volunteerId}
Authorization: Bearer {token}
```

#### Get Request Reviews
```http
GET /api/reviews/request/{requestId}
Authorization: Bearer {token}
```

---

### **5. Dashboard & Statistics**

#### Get Dashboard Statistics
```http
GET /api/dashboard/statistics
Authorization: Bearer {token}
```

#### Get User Activity
```http
GET /api/dashboard/activity/{userId}
Authorization: Bearer {token}
```

---

## 📊 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    role ENUM('ADMIN', 'LANSIA', 'RELAWAN') NOT NULL,
    city VARCHAR(50),
    province VARCHAR(50),
    address_detail TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Requests Table**
```sql
CREATE TABLE requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    lansia_user_id INT NOT NULL,
    layanan VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    duration INT NOT NULL,
    status ENUM('OFFERED', 'ASSIGNED', 'ON_GOING', 'DONE', 'CANCELLED') DEFAULT 'OFFERED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (lansia_user_id) REFERENCES users(user_id)
);
```

### **Reviews Table**
```sql
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (volunteer_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);
```

---

## 📸 Screenshots

Lihat folder:
- `ss-admin/` - Screenshot fitur admin
- `ss-lansia/` - Screenshot fitur lansia
- `ss-relawan/` - Screenshot fitur relawan

---

## 🔧 Testing Flow

### **Scenario 1: Complete Service Flow**

1. **Login sebagai Lansia** (`sitiaminah`)
2. **Create Request** (Bantuan ke Rumah Sakit)
3. **Login sebagai Volunteer** (`ahmadrizki`)
4. **Accept Request**
5. **Start Request**
6. **Complete Request**
7. **Login kembali sebagai Lansia**
8. **Create Review** untuk volunteer

### **Scenario 2: Update & Cancel**

1. **Login sebagai Lansia** (`budisantoso`)
2. **Create Request** (Belanja)
3. **Update Request** (ubah waktu)
4. **Cancel Request**

### **Scenario 3: Admin Management**

1. **Login sebagai Admin**
2. **Get All Users**
3. **View Statistics**
4. **Manage Users**

---

## 📝 Notes

- Semua password untuk testing: `password123` (kecuali admin: `admin123`)
- Base URL development: `http://localhost:9000/api`
- Semua endpoint (kecuali auth) memerlukan JWT token di header Authorization
- Format datetime: ISO 8601 (`YYYY-MM-DDTHH:mm:ss`)
- Duration dalam menit

---
