import { Router } from "express";
import { pool } from "../db/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * POST /attendance/:eventId
 * Body: { scanned_at: "2025-01-01T10:30:00" }
 */
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { scanned_at } = req.body;
    console.log("Attendance request body:", req.body);

    if (!scanned_at) {
      return res.status(400).json({ error: "scanned_at is required" });
    }

    const scannedTime = new Date(scanned_at);

    // Fetch event (we need start & end time)
    const [events] = await pool.query(
      "SELECT event_id, start_date, end_date FROM events WHERE event_id=?",
      [eventId]
    );

    if (!events.length) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = events[0];
    const eventStart = new Date(event.start_date);
    const eventEnd = new Date(event.end_date);
    console.log("Event times:", { eventStart, eventEnd, scannedTime });

    // Validate time range
    if (scannedTime < eventStart) {
      return res.status(400).json({ 
        status: "early",
        message: "Acara belum dimulai" 
      });
    }

    if (scannedTime > eventEnd) {
      return res.status(400).json({ 
        status: "late",
        message: "Acara sudah selesai" 
      });
    }

    // Check if user already submitted attendance
    const [exist] = await pool.query(
      "SELECT id FROM event_attendance WHERE user_id=? AND event_id=?",
      [userId, eventId]
    );

    if (exist.length > 0) {
      return res.json({
        status: "already_recorded",
        message: "Presensi sudah dicatat sebelumnya",
        event_id: eventId
      });
    }

    // Insert attendance
    await pool.query(
      "INSERT INTO event_attendance (user_id, event_id, scanned_at) VALUES (?,?,?)",
      [userId, eventId, scanned_at]
    );

    res.json({
      status: "success",
      message: "Presensi berhasil dicatat",
      event_id: eventId,
      scanned_at
    });

  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

export default router;
