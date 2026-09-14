const express = require("express");
const router = express.Router();

const pool = require("../db");

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image_url,
      latitude,
      longitude,
      address,
      reported_by,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO issues
      (title, description, category, image_url, latitude, longitude, address, reported_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        title,
        description,
        category,
        image_url || null,
        latitude || null,
        longitude || null,
        address || null,
        reported_by,
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