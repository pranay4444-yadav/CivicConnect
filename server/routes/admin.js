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

// =========================================================
// Get All Issues
// =========================================================

router.get("/issues", authenticateToken, async (req, res) => {
  try {
    // Only admins can access this route
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can access issues",
      });
    }

    const result = await pool.query(`
  SELECT
    i.id,
    i.title,
    i.description,
    i.category,
    i.status,
    i.created_at,
    u.name AS reporter_name
  FROM issues i
  LEFT JOIN users u ON i.reported_by = u.id
  ORDER BY i.created_at DESC
`);

    res.json({
      issues: result.rows,
    });
  } catch (error) {
    console.error("Error fetching admin issues:", error);

    res.status(500).json({
      message: "Failed to fetch issues",
    });
  }
});

// =========================================================
// Get All Users
// =========================================================

router.get("/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can access users",
      });
    }

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      users: result.rows,
    });

  } catch (error) {
    console.error("Error fetching admin users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// =========================================================
// Update User Role
// =========================================================

router.patch("/users/:id/role", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can update user roles",
      });
    }

    const userId = req.params.id;
    const { role } = req.body;

    const allowedRoles = [
      "CITIZEN",
      "AUTHORITY",
      "ADMIN",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid user role",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, name, email, role`,
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User role updated successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Error updating user role:", error);

    res.status(500).json({
      message: "Failed to update user role",
    });
  }
});


// =========================================================
// Get All Neighbourhoods
// =========================================================

router.get("/neighbourhoods", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can access neighbourhoods",
      });
    }

    const result = await pool.query(`
      SELECT
        n.id,
        n.name,
        n.description,
        n.created_at,
        u.name AS created_by_name,
        COUNT(DISTINCT nm.user_id) AS member_count,
        COUNT(DISTINCT i.id) AS issue_count
      FROM neighbourhoods n
      LEFT JOIN users u
        ON n.created_by = u.id
      LEFT JOIN neighbourhood_members nm
        ON n.id = nm.neighbourhood_id
      LEFT JOIN issues i
        ON n.id = i.neighbourhood_id
      GROUP BY
        n.id,
        n.name,
        n.description,
        n.created_at,
        u.name
      ORDER BY n.created_at DESC
    `);

    res.json({
      neighbourhoods: result.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching admin neighbourhoods:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch neighbourhoods",
    });
  }
});

module.exports = router;