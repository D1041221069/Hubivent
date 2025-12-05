START TRANSACTION;

-- Categories
INSERT INTO categories (`key`, color) VALUES
('Umum', '#334155'),
('Seminar', '#16a34a'),
('Kompetisi', '#2563eb'),
('Workshop', '#f97316'),
('Lomba', '#9333ea')
ON DUPLICATE KEY UPDATE `key` = `key`;

-- Users (password_hash contoh: hash bcrypt dummy)
INSERT INTO users (role, user_id, email, password_hash, username) VALUES
('admin', 1, 'admin@hubivent.com', '$2b$10$lige3ROK3LMT./VR4JokGeQTJzwOsZ.CLYOuM5NMOi.TsEcUNgavC', 'Admin'),
('user', 2, 'user@hubivent.com', '$2b$10$lige3ROK3LMT./VR4JokGeQTJzwOsZ.CLYOuM5NMOi.TsEcUNgavC', 'User Satu')
ON DUPLICATE KEY UPDATE email = email;

-- Sample events (UUID statis biar gampang)
INSERT INTO events (event_id, title, description, category, start_date, end_date, location)
VALUES
('11111111-1111-1111-1111-111111111111', 'Seminar Teknologi AI', 'Belajar dasar AI', 'Seminar', '2025-01-20 09:00:00', '2025-01-20 17:00:00', 'Aula Utama'),
('22222222-2222-2222-2222-222222222222', 'Workshop UI/UX', 'Desain antarmuka modern', 'Workshop', '2025-02-05 13:00:00', '2025-02-05 16:00:00', 'Lab Komputer'),
('33333333-3333-3333-3333-333333333333', 'Lomba Coding 2025', 'Kompetisi pemrograman', 'Kompetisi', '2025-03-10 08:00:00', '2025-03-10 18:00:00', 'Gedung Informatika')
ON DUPLICATE KEY UPDATE title = title;

-- Bookmarks dummy
INSERT INTO event_bookmarks (user_id, event_id)
VALUES
(2, '11111111-1111-1111-1111-111111111111'),
(2, '22222222-2222-2222-2222-222222222222')
ON DUPLICATE KEY UPDATE user_id = user_id;

-- RSVPs dummy
INSERT INTO event_rsvps (user_id, event_id, status)
VALUES
(2, '11111111-1111-1111-1111-111111111111', 'going'),
(2, '22222222-2222-2222-2222-222222222222', 'interested')
ON DUPLICATE KEY UPDATE status = status;

-- Feedbacks dummy
INSERT INTO event_feedbacks (user_id, event_id, rating, feedback)
VALUES
(2, '11111111-1111-1111-1111-111111111111', 5, 'Event sangat bermanfaat!')
ON DUPLICATE KEY UPDATE rating = rating;

-- Attendance dummy
INSERT INTO event_attendance (user_id, event_id)
VALUES
(2, '11111111-1111-1111-1111-111111111111')
ON DUPLICATE KEY UPDATE user_id = user_id;

COMMIT;