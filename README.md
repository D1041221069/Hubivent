# Hubivent - UAS Pemrograman Perangkat Bergerak

## Identitas Tim Pengembang
### Mahasiswa 1
- **Nama**: Galuh Budi Marthaningrum
- **NIM**: D1041221056

### Mahasiswa 2
- **Nama**: Harry Sanjaya
- **NIM**: D1041221069

### Mahasiswa 3
- **Nama**: Muhammad Fathur Rizqi
- **NIM**: D1041221020

---

## Deskripsi Aplikasi
**Hubivent** adalah aplikasi **Manajemen Event** (dan file terkait) yang dirancang untuk memudahkan pengguna dalam mencari, menyimpan, dan mengikuti berbagai kegiatan atau acara. Aplikasi ini menyediakan platform yang terintegrasi bagi penyelenggara untuk mengelola acara dan bagi peserta untuk berinteraksi dengan acara tersebut.

Fokus utama aplikasi ini adalah memberikan pengalaman pengguna yang mulus dalam manajemen kehadiran (presensi) dan interaksi pasca-acara.

## Fitur-Fitur Utama

### 1. User (Pengguna)
- **Bookmark Event**: Pengguna dapat menyimpan event yang diminati ke dalam daftar bookmark untuk akses cepat di kemudian hari.
- **Presensi via QR Code**: Sistem presensi modern yang menggunakan pemindaian QR Code. Pengguna cukup memindai kode QR yang disediakan di lokasi acara untuk mencatat kehadiran mereka secara otomatis.
- **Feedback (Ulasan)**: Setelah mengikuti acara, pengguna dapat memberikan ulasan atau feedback mengenai acara tersebut untuk membantu penyelenggara meningkatkan kualitas acara di masa depan.
- **Manajemen Profil**: Pengguna dapat mengelola informasi profil mereka sendiri.

### 2. Admin (Penyelenggara)
- **Manajemen Event**: Membuat, mengedit, dan menghapus event (termasuk upload gambar poster event).
- **Monitoring Presensi**: Memberikan QR Code untuk acara yang diadakan.

---

## Arsitektur Backend API
Aplikasi ini didukung oleh backend yang kuat dan aman menggunakan teknologi berikut:

- **Framework**: Node.js & Express.js untuk membangun RESTful API yang cepat dan skalabel.
- **Database**: MySQL untuk penyimpanan data relasional yang terstruktur (user, events, bookmarks, dll).
- **Autentikasi**: JSON Web Token (JWT) untuk mengamankan endpoint dan memastikan hanya pengguna yang sah yang dapat mengakses fitur tertentu.
- **File Management**: Menggunakan `multer` untuk menangani upload file (seperti gambar poster event/banner).

### Struktur API Endpoint Utama:
- `/auth`: Menangani registrasi dan login pengguna.
- `/events`: Endpoint CRUD untuk data event.
- `/bookmarks`: Mengelola fitur simpan event.
- `/presence`: Endpoint untuk mencatat kehadiran pengguna.
- `/feedback`: Endpoint untuk mengirim dan membaca ulasan event.

---

## Cara Penggunaan & Instalasi

### 1. Clone Repository
Salin repository ini ke komputer lokal Anda:
```bash
git clone git@github.com:D1041221069/Hubivent.git
```

### 2. Backend Setup
Masuk ke folder backend, instal dependensi, dan siapkan database.

**Langkah-langkah:**
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. **Konfigurasi Database**:
   - Pastikan XAMPP (MySQL) sudah aktif.
   - Sesuaikan file `.env` dengan konfigurasi database Anda (username, password, nama database).
4. Jalankan migrasi dan seeder database:
   ```bash
   npm run db          # Membuat tabel
   npm run db:seeder   # Mengisi data awal (seeding)
   ```
5. Jalankan server backend:
   ```bash
   npm run start
   ```

### 3. Mobile Setup (Frontend)
Jalankan aplikasi mobile (React Native / Expo).

**Langkah-langkah:**
1. Buka terminal baru dan masuk ke direktori mobile:
   ```bash
   cd mobile
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run start
   ```
   *Gunakan aplikasi Expo Go di HP Anda atau Android Emulator untuk menjalankan aplikasi.*

---

## Akun Default (Demo)
Gunakan akun berikut untuk menguji aplikasi tanpa perlu registrasi ulang.

### Akun Admin
- **Email**: `admin@hubivent.com`
- **Password**: `12345678`

### Akun User
- **Email**: `user@hubivent.com`
- **Password**: `12345678`