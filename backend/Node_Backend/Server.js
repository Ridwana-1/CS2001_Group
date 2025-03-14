const express = require("express");
const cors = require("cors");
const { sendEmail, saveEmailLog } = require("./EmailService");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

let disputes = []; // Initialize the 'disputes' array here to store submitted disputes in DB

app.get("/", (req, res) => {
  res.send("Server is running!");
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

    disputes.push(disputeData); // Push the new dispute data into the 'disputes' array

    const emailResult = await sendEmail(email, disputeData);

    await saveEmailLog(email, "Dispute Submitted", `Your dispute has been submitted.\n\nOrder ID: ${disputeData.orderId}\nReason: ${disputeData.reason}\nDescription: ${disputeData.description}\nReference: ${disputeData.reference}\nStatus: ${disputeData.status}`);
    
    res.status(201).json({ id: disputeReference, message: "Dispute submitted successfully." });
  } catch (error) {
    console.error("Error submitting dispute or sending email:", error);
    res.status(500).json({ message: "Dispute submitted, but email notification failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
