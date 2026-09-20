const express = require("express");

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get notifications for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        n.id,
        n.type,
        n.message,
        n.issue_id,
        n.is_read,
        n.created_at,
        i.title AS issue_title
       FROM notifications n
       LEFT JOIN issues i
         ON n.issue_id = i.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json({
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

// Mark a notification as read
router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1
         AND user_id = $2
       RETURNING *`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    res.status(500).json({
      message: "Failed to update notification",
    });
  }
});

module.exports = router;