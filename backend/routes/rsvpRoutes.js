import { Router } from "express";
import { pool } from "../db/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * POST /rsvp/:eventId
 */
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
  const { eventId } = req.params;
  const userId = req.user.id;
  const { status = "going" } = req.body;

  // Check event exists
  const [event] = await pool.query(
    "SELECT event_id FROM events WHERE event_id=?",
    [eventId]
  );
  if (!event.length) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Check existing RSVP
  const [exist] = await pool.query(
    "SELECT id, status FROM event_rsvps WHERE user_id=? AND event_id=?",
    [userId, eventId]
  );

  // CASE 1: Belum pernah RSVP → INSERT
  if (exist.length === 0) {
    await pool.query(
      "INSERT INTO event_rsvps (user_id, event_id, status) VALUES (?,?,?)",
      [userId, eventId, status]
    );
    return res.json({
      message: "RSVP submitted",
      event_id: eventId,
      status
    });
  }

  const existingStatus = exist[0].status;

  // CASE 2: Status sama → SKIP
  if (existingStatus === status) {
    return res.json({
      message: "RSVP unchanged (same status)",
      event_id: eventId,
      status
    });
  }

  // CASE 3: Status berbeda → UPDATE
  await pool.query(
    "UPDATE event_rsvps SET status=? WHERE id=?",
    [status, exist[0].id]
  );

  return res.json({
    message: "RSVP updated",
    event_id: eventId,
    old_status: existingStatus,
    new_status: status
  });

} catch (err) {
  console.error("RSVP error:", err);
  res.status(500).json({ error: "Failed to submit RSVP" });
}
});

export default router;
