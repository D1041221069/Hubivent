import { Router } from 'express';
import { pool } from '../db/config.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

/**
 * GET /events
 * Mendapatkan semua event
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT event_id, title, description, category, start_date, end_date , location, image_url, created_at, updated_at
      FROM events
      ORDER BY start_date ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('GET /events error:', error);
    res.status(500).json({ message: 'Failed to load events' });
  }
});

/**
 * GET /events/:id
 * Mendapatkan event berdasarkan ID
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE event_id = ?',
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Event not found' });
    return res.json(rows[0]);
  } catch (error) {
    console.error('GET /events/:id error:', error);
    res.status(500).json({ message: 'Failed to get event' });
  }
});

/**
 * POST /events
 * Membuat event baru (ADMIN)
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      event_id,
      title,
      description = null,
      start_date,
      end_date,
      category = 'Umum',
      location
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!event_id || !title || !start_date || !end_date || !location) {
      return res.status(400).json({ message: 'event_id, title, start_date, end_date, location are required' });
    }

    await pool.query(
      `
      INSERT INTO events 
      (event_id, title, description, category, start_date, end_date, location, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [event_id, title, description, category, start_date, end_date, location, image_url]
    );

    res.status(201).json({ ok: true, image_url });
  } catch (error) {
    console.error('POST /events error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

/**
 * PUT /events/:id
 * Update event
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const fields = [
      'title',
      'description',
      'category',
      'start_date',
      'end_date',
      'location'
    ];

    const set = [];
    const values = [];

    for (const f of fields) {
      if (req.body[f] !== undefined) {
        set.push(`${f}=?`);
        values.push(req.body[f]);
      }
    }

    if (req.file) {
      set.push('image_url=?');
      values.push(`/uploads/${req.file.filename}`);
    }

    if (!set.length) return res.status(400).json({ message: 'No changes to update' });

    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE events SET ${set.join(', ')} WHERE event_id=?`,
      values
    );

    if (!result.affectedRows) return res.status(404).json({ message: 'Event not found' });

    res.json({ ok: true });
  } catch (error) {
    console.error('PUT /events/:id error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

/**
 * DELETE /events/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM events WHERE event_id=?',
      [req.params.id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: 'Event not found' });

    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE /events/:id error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

export default router;

