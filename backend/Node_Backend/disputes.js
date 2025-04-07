const express = require("express");
const router = express.Router();
const pool = require("./Database"); // Db connection

// GET all disputes from the report_emails table 
router.get("/disputes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM report_emails");
    res.json({ disputes: rows });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({ error: "Failed to fetch disputes" });
  }
});



module.exports = router;

