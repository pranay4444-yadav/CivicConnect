const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const issuesRoutes = require("./routes/issues");
const authRoutes = require("./routes/auth");
const neighbourhoodsRoutes = require("./routes/neighbourhoods");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/issues", issuesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/neighbourhoods", neighbourhoodsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "CivicConnect API is running!",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`CivicConnect server running on http://localhost:${PORT}`);
});