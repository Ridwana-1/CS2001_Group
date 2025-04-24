// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',    // ← your real password
  database: 'product_db'      // ← your real DB name (case-sensitive!)
});

db.connect(err => {
  if (err) {
    console.error(' MySQL connection error:', err);
    process.exit(1);
  }
  console.log(' Connected to MySQL');
});

// expose /api/users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// expose /api/products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// expose /api/swipes
app.get('/api/swipes', (req, res) => {
  db.query('SELECT * FROM swipes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(' Server listening on http://localhost:${PORT}');
});