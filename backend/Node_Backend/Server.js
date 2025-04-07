const express = require("express");
const cors = require("cors");
const { sendEmail, saveEmailLog } = require("./EmailService");
require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NewPassword",
  database: "Transaction_System"
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");

  // Create users table with additional fields
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createUsersTable, (err) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table checked/created");

    // Create admin user if it doesn't exist
    bcrypt.hash(process.env.ADMIN_PASSWORD || "adminSecurePassword", 10, (err, hash) => {
      if (err) {
        console.error("Error hashing admin password:", err);
        return;
      }

      const checkAdmin = "SELECT * FROM users WHERE email = ?";
      db.query(checkAdmin, [process.env.ADMIN_EMAIL || "admin@example.com"], (err, result) => {
        if (err) {
          console.error("Error checking admin:", err);
          return;
        }

        if (result.length === 0) {
          // Create admin if doesn't exist
          const createAdmin = "INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)";
          db.query(createAdmin, [
            process.env.ADMIN_EMAIL || "admin@example.com",
            hash,
            "admin",
            "Admin",
            "User"
          ], (err) => {
            if (err) console.error("Error creating admin user:", err);
            else console.log("Admin user created");
          });
        }
      });
    });
  });

  // Create messages table if it doesn't exist
  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      room VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createMessagesTable, (err) => {
    if (err) console.error("Error creating messages table:", err);
  });

  // Create report_emails table with all required fields
  const createReportEmailsTable = `
    CREATE TABLE IF NOT EXISTS report_emails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recipient_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      resolution TEXT,
      rejection_reason TEXT,
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createReportEmailsTable, (err) => {
    if (err) console.error("Error creating report_emails table:", err);
    else console.log("Report emails table checked/created");
  });
});

const promiseDb = db.promise();



// Register new user endpoint
app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await promiseDb.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await promiseDb.query(
      "INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, "user", firstName || null, lastName || null]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      email,
      role: "user"
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user"
    });
  }
});

// Login route for admin and users
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    // Find user in database
    const [users] = await promiseDb.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = users[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Return user info without password
      const { password, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        ...userWithoutPassword
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Get current user profile
app.get("/user/profile", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email parameter is required"
    });
  }

  try {
    const [users] = await promiseDb.query(
      "SELECT id, email, role, first_name, last_name, created_at FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ========================
// Chat System REST Endpoints
// ========================

// GET available rooms for the user
app.get("/api/rooms", async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ message: "Email query parameter is required." });
  }
  try {
    // Query distinct rooms where the user has sent messages
    const [rows] = await promiseDb.query(
      "SELECT DISTINCT room FROM messages WHERE email = ?",
      [userEmail]
    );
    // If no rooms exist, return a default room
    if (rows.length === 0) {
      return res.json({ rooms: [{ id: "default" }] });
    }
    const rooms = rows.map(row => ({ id: row.room }));
    res.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms." });
  }
});

// GET messages for a room (with optional filtering by timestamp)
app.get("/api/messages", async (req, res) => {
  const room = req.query.room;
  const since = req.query.since;
  if (!room) {
    return res.status(400).json({ message: "Room parameter is required." });
  }
  try {
    let query = "SELECT * FROM messages WHERE room = ? ";
    let params = [room];
    if (since) {
      query += "AND created_at > ? ";
      params.push(since);
    }
    query += "ORDER BY created_at ASC";
    const [rows] = await promiseDb.query(query, params);
    res.json({ messages: rows });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages." });
  }
});

// POST a new message
app.post("/api/messages", async (req, res) => {
  const { email, message, room, timestamp } = req.body;
  if (!email || !message || !room) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  try {
    // Insert new message into the database
    const query = "INSERT INTO messages (email, message, room, created_at) VALUES (?, ?, ?, ?)";
    const messageTimestamp = timestamp || new Date().toISOString();
    await promiseDb.query(query, [email, message, room, messageTimestamp]);
    res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message." });
  }
});


app.post("/transactions/disputes", async (req, res) => {
  try {
    const { orderId, email, reason, description } = req.body;
    if (!orderId || !email || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const disputeReference = `DSP-${Math.floor(Math.random() * 10000) + 1000}`;

    const disputeData = {
      orderId,
      email,
      reason,
      description,
      reference: disputeReference,
      status: "Pending"
    };

    const subject = 'Dispute submitted';

    let emailMessage = `
Order ID: ${disputeData.orderId}
Reason: ${disputeData.reason}
Reference: ${disputeData.reference}
Description: ${disputeData.description}
Status: Pending`;

    // Insert dispute record into report_emails table with status field
    await promiseDb.query(
      "INSERT INTO report_emails (recipient_email, subject, message, status) VALUES (?, ?, ?, ?)",
      [email, subject, emailMessage, "Pending"]
    );

    // Send email and save email log
    await sendEmail(email, subject, emailMessage);
    await saveEmailLog(email, subject, emailMessage);

    res
      .status(201)
      .json({ id: disputeReference, message: "Dispute submitted successfully." });
  } catch (error) {
    console.error("Error processing dispute:", error);
    res
      .status(500)
      .json({ message: "Dispute submitted, but email notification failed." });
  }
});

app.get("/transactions/disputes", async (req, res) => {
  try {
    console.log("Fetching disputes from database");

    // Query all reports from the database
    const [rows] = await promiseDb.query(
      "SELECT * FROM report_emails ORDER BY sent_at DESC"
    );

    // Normalize disputes data
    const disputes = rows.map(row => ({
      ...row,
      status: row.status || 'Pending',
      id: row.id
    }));

    console.log("Sending disputes:", disputes);
    res.status(200).json({ disputes });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({ message: "Error fetching disputes." });
  }
});

// PUT endpoint to accept a dispute
app.put("/transactions/disputes/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, adminNotes } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "Dispute ID is required" });
    }

    console.log(`Accepting dispute with ID: ${id}`);

    // First, get the dispute details to retrieve the recipient email
    const [disputeRows] = await promiseDb.query(
      "SELECT * FROM report_emails WHERE id = ?",
      [id]
    );

    if (disputeRows.length === 0) {
      return res.status(404).json({ message: "Dispute not found" });
    }

    const dispute = disputeRows[0];
    const recipientEmail = dispute.recipient_email;

    // Update the dispute status in the database
    await promiseDb.query(
      "UPDATE report_emails SET status = ?, resolution = ?, admin_notes = ? WHERE id = ?",
      ["Accepted", resolution || "", adminNotes || "", id]
    );

    const subject = 'Your dispute has been accepted';
    const emailMessage = `
Reference: ${id}
Status: Accepted
${resolution ? `Resolution: ${resolution}` : ''}
${adminNotes ? `Additional Notes: ${adminNotes}` : ''}

Thank you for your patience.`;

    // Send email notification to the user
    await sendEmail(recipientEmail, subject, emailMessage);
    await saveEmailLog(recipientEmail, subject, emailMessage);

    console.log(`Dispute ${id} accepted successfully`);
    res.status(200).json({ message: "Dispute accepted successfully" });
  } catch (error) {
    console.error("Error accepting dispute:", error);
    res.status(500).json({ message: "Error accepting dispute" });
  }
});

// PUT endpoint to reject a dispute
app.put("/transactions/disputes/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, adminNotes } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "Dispute ID is required" });
    }

    console.log(`Rejecting dispute with ID: ${id}`);

    // Get the dispute details to retrieve the recipient email
    const [disputeRows] = await promiseDb.query(
      "SELECT * FROM report_emails WHERE id = ?",
      [id]
    );

    if (disputeRows.length === 0) {
      return res.status(404).json({ message: "Dispute not found" });
    }

    const dispute = disputeRows[0];
    const recipientEmail = dispute.recipient_email;

    // Update dispute status in the database
    await promiseDb.query(
      "UPDATE report_emails SET status = ?, rejection_reason = ?, admin_notes = ? WHERE id = ?",
      ["Rejected", reason || "No reason provided", adminNotes || "", id]
    );

    const emailMessage = `Your dispute has been rejected.
Reference: ${id}
Status: Rejected
Reason: ${reason || "No reason provided"}
${adminNotes ? `Additional Notes: ${adminNotes}` : ''}

If you have any questions, please contact our support team.`;

    // Send email notification to the user
    await sendEmail(recipientEmail, "Dispute Rejected", emailMessage);
    await saveEmailLog(recipientEmail, "Dispute Rejected", emailMessage);

    console.log(`Dispute ${id} rejected successfully`);
    res.status(200).json({ message: "Dispute rejected successfully" });
  } catch (error) {
    console.error("Error rejecting dispute:", error);
    res.status(500).json({ message: "Error rejecting dispute" });
  }
});

// ========================
// Basic Route & Server Start
// ========================

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});