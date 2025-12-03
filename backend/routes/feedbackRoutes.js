import { Router } from "express";
import { pool } from "../db/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * POST /feedback/:eventId
 */
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { rating, feedback = null } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check event exists
    const [event] = await pool.query(
      "SELECT event_id FROM events WHERE event_id=?",
      [eventId]
    );

    if (!event.length) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check existing feedback
    const [exist] = await pool.query(
      "SELECT id FROM event_feedbacks WHERE user_id=? AND event_id=?",
      [userId, eventId]
    );

    // CASE 1: Insert if not exist
    if (exist.length === 0) {
      await pool.query(
        "INSERT INTO event_feedbacks (user_id, event_id, rating, feedback) VALUES (?,?,?,?)",
        [userId, eventId, rating, feedback]
      );
      return res.json({
        message: "Feedback submitted",
        event_id: eventId,
        rating,
        feedback,
      });
    }

    // CASE 2: Update if already exists
    await pool.query(
      "UPDATE event_feedbacks SET rating=?, feedback=? WHERE id=?",
      [rating, feedback, exist[0].id]
    );

    res.json({
      message: "Feedback updated",
      event_id: eventId,
      rating,
      feedback,
    });

  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;
