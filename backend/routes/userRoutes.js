import { Router } from "express";
import { pool } from "../db/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * GET /user/events
 * Mengembalikan semua event + status user (bookmark, rsvp, feedback, attendance)
 */
router.get("/events", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        e.*,

        -- Bookmark status
        CASE WHEN b.id IS NOT NULL THEN TRUE ELSE FALSE END AS bookmarked,

        -- RSVP status
        r.status AS rsvp_status,

        -- Feedback status
        CASE WHEN f.id IS NOT NULL THEN TRUE ELSE FALSE END AS feedback_given,

        -- Attendance status
        CASE WHEN a.id IS NOT NULL THEN TRUE ELSE FALSE END AS attended

      FROM events e

      -- LEFT JOIN USER RELATIONS
      LEFT JOIN event_bookmarks b 
        ON b.event_id = e.event_id AND b.user_id = ?

      LEFT JOIN event_rsvps r
        ON r.event_id = e.event_id AND r.user_id = ?

      LEFT JOIN event_feedbacks f
        ON f.event_id = e.event_id AND f.user_id = ?

      LEFT JOIN event_attendance a
        ON a.event_id = e.event_id AND a.user_id = ?

      ORDER BY e.start_date ASC
      `,
      [userId, userId, userId, userId]
    );

    res.json(rows);

  } catch (err) {
    console.error("User events error:", err);
    res.status(500).json({ error: "Failed to load user events" });
  }
});

export default router;
