const express = require("express");

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// Admin Dashboard Statistics
// =========================================================

router.get("/stats", authenticateToken, async (req, res) => {
  try {
    // Only admins can access this route
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can access this dashboard",
      });
    }

    const usersResult = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const issuesResult = await pool.query(
      "SELECT COUNT(*) AS total_issues FROM issues"
    );

    const neighbourhoodsResult = await pool.query(
      "SELECT COUNT(*) AS total_neighbourhoods FROM neighbourhoods"
    );

    const openIssuesResult = await pool.query(
      `SELECT COUNT(*) AS open_issues
       FROM issues
       WHERE status NOT IN ('RESOLVED', 'CLOSED')`
    );

    res.json({
      stats: {
        total_users: Number(usersResult.rows[0].total_users),
        total_issues: Number(issuesResult.rows[0].total_issues),
        total_neighbourhoods: Number(
          neighbourhoodsResult.rows[0].total_neighbourhoods
        ),
        open_issues: Number(openIssuesResult.rows[0].open_issues),
      },
    });

  } catch (error) {
    console.error("Error fetching admin statistics:", error);

    res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
});

module.exports = router;