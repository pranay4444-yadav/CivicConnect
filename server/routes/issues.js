const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
  `SELECT
    issues.*,
    users.name AS reporter_name,

    (
      SELECT COUNT(*)
      FROM issue_support
      WHERE issue_support.issue_id = issues.id
    ) AS support_count,

    (
      SELECT COUNT(*)
      FROM issue_verifications
      WHERE issue_verifications.issue_id = issues.id
    ) AS verification_count

   FROM issues
   JOIN users ON issues.reported_by = users.id
   ORDER BY issues.created_at DESC`
);

    res.json({
      issues: result.rows,
    });

  } catch (error) {
    console.error("Error fetching issues:", error);

    res.status(500).json({
      message: "Failed to fetch issues",
    });
  }
});

router.get("/authorities/list", authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "AUTHORITY" && userRole !== "ADMIN") {
      return res.status(403).json({
        message: "Only authorities and admins can view authority users",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE role = 'AUTHORITY'
       ORDER BY name ASC`
    );

    res.json({
      authorities: result.rows,
    });

  } catch (error) {
    console.error("Error fetching authorities:", error);

    res.status(500).json({
      message: "Failed to fetch authorities",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issueId = req.params.id;

    const result = await pool.query(
      `SELECT
        issues.*,
        users.name AS reporter_name,
        neighbourhoods.name AS neighbourhood_name,
        assigned_user.name AS assigned_authority_name,
        assigned_user.email AS assigned_authority_email
       FROM issues
       JOIN users ON issues.reported_by = users.id
       LEFT JOIN neighbourhoods
        ON issues.neighbourhood_id = neighbourhoods.id
       LEFT JOIN users AS assigned_user
        ON issues.assigned_to = assigned_user.id 
       WHERE issues.id = $1`,
      [issueId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Get support count
    const supportResult = await pool.query(
      `SELECT COUNT(*) AS support_count
       FROM issue_support
       WHERE issue_id = $1`,
      [issueId]
    );
    
    // Get verification count
    const verificationResult = await pool.query(
      `SELECT COUNT(*) AS verification_count
       FROM issue_verifications
       WHERE issue_id = $1`,
      [issueId]
    );
    res.json({
      issue: {
        ...result.rows[0],
        support_count: Number(supportResult.rows[0].support_count),
        verification_count: Number(
          verificationResult.rows[0].verification_count
        ),
      },
    });

  } catch (error) {
    console.error("Error fetching issue:", error);

    res.status(500).json({
      message: "Failed to fetch issue",
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const issueId = req.params.id;

    const result = await pool.query(
      `SELECT
        comments.id,
        comments.issue_id,
        comments.text,
        comments.created_at,
        users.name AS user_name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.issue_id = $1
       ORDER BY comments.created_at ASC`,
      [issueId]
    );

    res.json({
      comments: result.rows,
    });

  } catch (error) {
    console.error("Error fetching comments:", error);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
});

router.get("/:id/status-history", async (req, res) => {
  try {
    const issueId = req.params.id;

    const result = await pool.query(
      `SELECT
        status_history.id,
        status_history.issue_id,
        status_history.status,
        status_history.comment,
        status_history.changed_at,
        users.name AS changed_by_name,
        users.role AS changed_by_role
       FROM status_history
       JOIN users
         ON status_history.changed_by = users.id
       WHERE status_history.issue_id = $1
       ORDER BY status_history.changed_at ASC`,
      [issueId]
    );

    res.json({
      history: result.rows,
    });

  } catch (error) {
    console.error("Error fetching status history:", error);

    res.status(500).json({
      message: "Failed to fetch status history",
    });
  }
});

router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    // Check whether the issue exists
    const issueResult = await pool.query(
      "SELECT id FROM issues WHERE id = $1",
      [issueId]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Add comment
    const result = await pool.query(
      `INSERT INTO comments (issue_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, issue_id, text, created_at`,
      [issueId, userId, text.trim()]
    );

    // Get user's name
    const userResult = await pool.query(
      "SELECT name FROM users WHERE id = $1",
      [userId]
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        ...result.rows[0],
        user_name: userResult.rows[0].name,
      },
    });

  } catch (error) {
    console.error("Error adding comment:", error);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
});

router.patch("/:id/assign", authenticateToken, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userRole = req.user.role;
    const { assigned_to } = req.body;

    if (userRole !== "AUTHORITY" && userRole !== "ADMIN") {
      return res.status(403).json({
        message: "Only authorities and admins can assign issues",
      });
    }

    if (!assigned_to) {
      return res.status(400).json({
        message: "Assigned authority is required",
      });
    }

    const authorityResult = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE id = $1
       AND role = 'AUTHORITY'`,
      [assigned_to]
    );

    if (authorityResult.rows.length === 0) {
      return res.status(404).json({
        message: "Authority user not found",
      });
    }

    const issueResult = await pool.query(
      `UPDATE issues
       SET assigned_to = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, assigned_to, updated_at`,
      [assigned_to, issueId]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.json({
      message: "Issue assigned successfully",
      issue: issueResult.rows[0],
      assigned_authority: authorityResult.rows[0],
    });

  } catch (error) {
    console.error("Error assigning issue:", error);

    res.status(500).json({
      message: "Failed to assign issue",
    });
  }
});

router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, comment } = req.body;

    // Only authorities and admins can update issue status
    if (userRole !== "AUTHORITY" && userRole !== "ADMIN") {
      return res.status(403).json({
        message: "Only authorities and admins can update issue status",
      });
    }

    const allowedStatuses = [
      "REPORTED",
      "UNDER REVIEW",
      "VERIFIED",
      "ASSIGNED",
      "IN PROGRESS",
      "RESOLVED",
      "CLOSED",
      "REJECTED",
      "DUPLICATE",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid issue status",
      });
    }

    // Check whether the issue exists
    const issueResult = await pool.query(
      `SELECT id, status, reported_by, title
      FROM issues
      WHERE id = $1`,
      [issueId]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const currentStatus = issueResult.rows[0].status;

    // Don't create unnecessary history entries
    if (currentStatus === status) {
      return res.status(400).json({
        message: "Issue is already in this status",
      });
    }

    // Update issue status
    const updatedIssue = await pool.query(
      `UPDATE issues
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, status, updated_at`,
      [status, issueId]
    );

    // Record status history
    await pool.query(
      `INSERT INTO status_history
       (issue_id, status, changed_by, comment)
       VALUES ($1, $2, $3, $4)`,
      [issueId, status, userId, comment || null]
    );

    await pool.query(
  `INSERT INTO notifications
   (user_id, type, message, issue_id)
   VALUES ($1, $2, $3, $4)`,
  [
    issueResult.rows[0].reported_by,
    "STATUS_UPDATE",
    `Your issue "${issueResult.rows[0].title}" has been updated to "${status}".`,
    issueId,
  ]
);

    res.json({
      message: "Issue status updated successfully",
      issue: updatedIssue.rows[0],
    });

  } catch (error) {
    console.error("Error updating issue status:", error);

    res.status(500).json({
      message: "Failed to update issue status",
    });
  }
});

router.post("/:id/support", authenticateToken, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    // Check whether the issue exists
    const issueResult = await pool.query(
      "SELECT id FROM issues WHERE id = $1",
      [issueId]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Check whether this user has already supported the issue
    const existingSupport = await pool.query(
      `SELECT id
       FROM issue_support
       WHERE issue_id = $1 AND user_id = $2`,
      [issueId, userId]
    );

    if (existingSupport.rows.length > 0) {
      return res.status(409).json({
        message: "You have already supported this issue",
      });
    }

    // Add support
    await pool.query(
      `INSERT INTO issue_support (issue_id, user_id)
       VALUES ($1, $2)`,
      [issueId, userId]
    );

    // Get updated support count
    const countResult = await pool.query(
      `SELECT COUNT(*) AS support_count
       FROM issue_support
       WHERE issue_id = $1`,
      [issueId]
    );

    res.status(201).json({
      message: "Issue supported successfully",
      supportCount: Number(countResult.rows[0].support_count),
    });

  } catch (error) {
    console.error("Error supporting issue:", error);

    res.status(500).json({
      message: "Failed to support issue",
    });
  }
});

router.post("/:id/verify", authenticateToken, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    // Check whether the issue exists
    const issueResult = await pool.query(
      "SELECT id FROM issues WHERE id = $1",
      [issueId]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Check whether this user has already verified the issue
    const existingVerification = await pool.query(
      `SELECT id
       FROM issue_verifications
       WHERE issue_id = $1 AND user_id = $2`,
      [issueId, userId]
    );

    if (existingVerification.rows.length > 0) {
      return res.status(409).json({
        message: "You have already verified this issue",
      });
    }

    // Add verification
    await pool.query(
      `INSERT INTO issue_verifications (issue_id, user_id)
       VALUES ($1, $2)`,
      [issueId, userId]
    );

    // Get updated verification count
    const countResult = await pool.query(
      `SELECT COUNT(*) AS verification_count
       FROM issue_verifications
       WHERE issue_id = $1`,
      [issueId]
    );

    res.status(201).json({
      message: "Issue verified successfully",
      verificationCount: Number(
        countResult.rows[0].verification_count
      ),
    });

  } catch (error) {
    console.error("Error verifying issue:", error);

    res.status(500).json({
      message: "Failed to verify issue",
    });
  }
});


router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image_url,
      latitude,
      longitude,
      address,
      neighbourhood_id,
    } = req.body;

    // The logged-in user's ID comes from the verified JWT.
    const reportedBy = req.user.id;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO issues
      (
        title,
        description,
        category,
        image_url,
        latitude,
        longitude,
        address,
        neighbourhood_id,
        reported_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        description,
        category,
        image_url || null,
        latitude || null,
        longitude || null,
        address || null,
        neighbourhood_id || null,
        reportedBy,
      ]
    );

    res.status(201).json({
      message: "Issue reported successfully",
      issue: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating issue:", error);

    res.status(500).json({
      message: "Failed to report issue",
    });
  }
});

module.exports = router;
