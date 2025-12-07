# Dokumentasi API Backend Hubivent

Berikut adalah dokumentasi lengkap mengenai endpoint API yang tersedia di backend Hubivent.

## Base URL
Semua request dilakukan ke alamat server backend (contoh: `http://localhost:3000`).

## Headers
Untuk endpoint yang memerlukan autentikasi, tambahkan header:
`Authorization: Bearer <token_jwt>`

---

## 1. Authentication (`/auth`)

### Register
Mendaftarkan pengguna baru.

- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword",
    "username": "Nama User",
    "role": "user" 
  }
  ```
  *(Role opsional, default "user". Bisa diisi "admin")*

### Login
Masuk ke aplikasi untuk mendapatkan Token JWT.

- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword"
  }
  ```
- **Response**: Mengembalikan object User dan `token`.

---

## 2. Events (`/events`)

### Get All Events
Mendapatkan semua daftar event yang tersedia.

- **Endpoint**: `GET /events`
- **Query Params**: Tidak ada.

### Get Event by ID
Mendapatkan detail satu event.

- **Endpoint**: `GET /events/:id`

### Create Event (Admin Only)
Membuat event baru. Mendukung upload gambar (multipart/form-data).

- **Endpoint**: `POST /events`
- **Header**: `Content-Type: multipart/form-data`
- **Body (FormData)**:
  - `event_id` (Text): ID unik event (misal: "EVT001")
  - `title` (Text): Judul event
  - `description` (Text): Deskripsi event
  - `category` (Text): Kategori event (misal: "Teknologi", "Musik")
  - `start_date` (Text): Waktu mulai (YYYY-MM-DD HH:mm:ss)
  - `end_date` (Text): Waktu selesai
  - `location` (Text): Lokasi acara
  - `image` (File): File gambar poster event

### Update Event (Admin Only)
Mengubah data event.

- **Endpoint**: `PUT /events/:id`
- **Body (FormData)**: Sama seperti Create Event, kirim field yang ingin diubah saja.

### Delete Event (Admin Only)
Menghapus event.

- **Endpoint**: `DELETE /events/:id`

---

## 3. Bookmarks (`/bookmark`)
*Memerlukan Token JWT*

### Add Bookmark
Menyimpan event ke daftar favorit user.

- **Endpoint**: `POST /bookmark/:eventId`
- **Params**: `eventId` adalah ID dari event.

### Remove Bookmark
Menghapus event dari daftar favorit.

- **Endpoint**: `DELETE /bookmark/:eventId`

---

## 4. Attendance / Presensi (`/attendance`)
*Memerlukan Token JWT*

### Record Attendance
Mencatat kehadiran user di suatu event (biasanya via scan QR).

- **Endpoint**: `POST /attendance/:eventId`
- **Body**:
  ```json
  {
    "scanned_at": "2024-12-12T10:00:00"
  }
  ```
- **Catatan**: 
  - Backend akan memvalidasi apakah waktu scan berada dalam rentang `start_date` dan `end_date` event.
  - Jika belum mulai, akan return error "early".
  - Jika sudah selesai, akan return error "late".

---

## 5. Feedback (`/feedback`)
*Memerlukan Token JWT*

### Submit Feedback
Memberikan ulasan dan rating untuk event yang telah diikuti.

- **Endpoint**: `POST /feedback/:eventId`
- **Body**:
  ```json
  {
    "rating": 5,
    "feedback": "Acaranya sangat seru dan bermanfaat!"
  }
  ```
  *(Rating harus angka 1-5)*

---

## 6. User Data (`/me`)
*Memerlukan Token JWT*

### Get User Events Status
Mendapatkan daftar event lengkap dengan status interaksi user (apakah sudah di-bookmark, sudah hadir, sudah memberi feedback, dll).

- **Endpoint**: `GET /me/events`
- **Response**: List of events dengan tambahan field boolean: `bookmarked`, `rsvp_status`, `feedback_given`, `attended`.
