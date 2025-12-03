import { Router } from "express";
import { pool } from "../db/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * POST /bookmark/:eventId
 */
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check event exists
    const [event] = await pool.query(
      "SELECT event_id FROM events WHERE event_id=?",
      [eventId]
    );
    if (!event.length) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if already bookmarked
    const [exist] = await pool.query(
      "SELECT id FROM event_bookmarks WHERE user_id=? AND event_id=?",
      [userId, eventId]
    );

    if (exist.length > 0) {
      return res.status(409).json({ error: "Already bookmarked" });
    }

    await pool.query(
      "INSERT INTO event_bookmarks (user_id, event_id) VALUES (?, ?)",
      [userId, eventId]
    );

    res.json({
      message: "Event bookmarked",
      event_id: eventId
    });

  } catch (err) {
    console.error("Bookmark error:", err);
    res.status(500).json({ error: "Failed to bookmark event" });
  }
});

/**
 * DELETE /bookmark/:eventId
 */
router.delete("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const [exist] = await pool.query(
      "SELECT id FROM event_bookmarks WHERE user_id=? AND event_id=?",
      [userId, eventId]
    );

    if (exist.length === 0) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    await pool.query(
      "DELETE FROM event_bookmarks WHERE id=?",
      [exist[0].id]
    );

    res.json({
      message: "Bookmark removed",
      event_id: eventId
    });

  } catch (err) {
    console.error("Delete bookmark error:", err);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

export default router;
