const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        issues.*,
        users.name AS reporter_name
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

router.get("/:id", async (req, res) => {
  try {
    const issueId = req.params.id;

    const result = await pool.query(
      `SELECT
        issues.*,
        users.name AS reporter_name,
        neighbourhoods.name AS neighbourhood_name
       FROM issues
       JOIN users ON issues.reported_by = users.id
       LEFT JOIN neighbourhoods
        ON issues.neighbourhood_id = neighbourhoods.id
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
