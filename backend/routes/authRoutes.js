import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/config.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    // Validasi minimal
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    // Cek apakah email sudah digunakan
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Role default: user
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, username, role) VALUES (?, ?, ?, ?)',
      [email, password_hash, username, assignedRole]
    );

    const newUser = { 
      id: result.insertId, 
      email, 
      username, 
      role: assignedRole 
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ambil user berdasarkan email
    const [users] = await pool.query(
      'SELECT user_id, email, password_hash, username, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    // Cek password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token yang berisi role
    const token = generateToken({
      id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});
export default router;