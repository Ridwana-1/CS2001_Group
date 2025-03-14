const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const pool = require("./Database"); 
const axios = require("axios");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

if (!EMAIL_USER) {
  console.error("EMAIL_USER is not configured in the environment variables.");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
  const accessTokenResponse = await oAuth2Client.getAccessToken();
  const accessToken = accessTokenResponse?.token;
  if (!accessToken) {
    throw new Error("Failed to retrieve access token.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
    logger: true,
    debug: true,
  });
}

async function sendEmail(to, disputeData) {
  try {
    const transporter = await createTransporter();
    await transporter.verify();

    const subject = "Dispute Submitted";
    const text = `Your dispute has been submitted.\n\nOrder ID: ${disputeData.orderId}\nReason: ${disputeData.reason}\nDescription: ${disputeData.description}\nReference: ${disputeData.reference}\nStatus: ${disputeData.status}`;

    const mailOptions = {
      from: `SwapSaviour <${EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function saveEmailLog(recipient, subject, message) {
  try {
    await pool.query(
      "INSERT INTO report_emails (recipient_email, subject, message) VALUES (?, ?, ?)",
      [recipient, subject, message]
    );
  } catch (error) {
    console.error("Error saving email log:", error);
  }
}

module.exports = { sendEmail, saveEmailLog };
