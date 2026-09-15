const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all neighbourhoods
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        description,
        latitude,
        longitude,
        created_by,
        created_at
       FROM neighbourhoods
       ORDER BY name ASC`
    );

    res.json({
      neighbourhoods: result.rows,
    });
  } catch (error) {
    console.error("Error fetching neighbourhoods:", error);

    res.status(500).json({
      message: "Failed to fetch neighbourhoods",
    });
  }
});

// Create a neighbourhood
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      latitude,
      longitude,
    } = req.body;

    const createdBy = req.user.id;

    if (!name) {
      return res.status(400).json({
        message: "Neighbourhood name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO neighbourhoods
       (
         name,
         description,
         latitude,
         longitude,
         created_by
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        description || null,
        latitude || null,
        longitude || null,
        createdBy,
      ]
    );

    // Automatically make the creator the neighbourhood head
    await pool.query(
      `INSERT INTO neighbourhood_members
       (
         neighbourhood_id,
         user_id,
         role
       )
       VALUES ($1, $2, $3)`,
      [
        result.rows[0].id,
        createdBy,
        "HEAD",
      ]
    );

    res.status(201).json({
      message: "Neighbourhood created successfully",
      neighbourhood: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating neighbourhood:", error);

    res.status(500).json({
      message: "Failed to create neighbourhood",
    });
  }
});


// Join a neighbourhood
router.post("/:id/join", authenticateToken, async (req, res) => {
  try {
    const neighbourhoodId = req.params.id;
    const userId = req.user.id;

    // Check whether the neighbourhood exists
    const neighbourhoodResult = await pool.query(
      "SELECT id FROM neighbourhoods WHERE id = $1",
      [neighbourhoodId]
    );

    if (neighbourhoodResult.rows.length === 0) {
      return res.status(404).json({
        message: "Neighbourhood not found",
      });
    }

    // Check whether the user is already a member
    const existingMember = await pool.query(
      `SELECT id
       FROM neighbourhood_members
       WHERE neighbourhood_id = $1 AND user_id = $2`,
      [neighbourhoodId, userId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({
        message: "You are already a member of this neighbourhood",
      });
    }

    // Add user as a regular member
    const result = await pool.query(
      `INSERT INTO neighbourhood_members
       (
         neighbourhood_id,
         user_id,
         role
       )
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        neighbourhoodId,
        userId,
        "MEMBER",
      ]
    );

    res.status(201).json({
      message: "Joined neighbourhood successfully",
      membership: result.rows[0],
    });

  } catch (error) {
    console.error("Error joining neighbourhood:", error);

    res.status(500).json({
      message: "Failed to join neighbourhood",
    });
  }
});

// Get neighbourhoods joined by the logged-in user
router.get("/my-memberships", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT neighbourhood_id, role
       FROM neighbourhood_members
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      memberships: result.rows,
    });
  } catch (error) {
    console.error("Error fetching memberships:", error);

    res.status(500).json({
      message: "Failed to fetch memberships",
    });
  }
});

module.exports = router;
