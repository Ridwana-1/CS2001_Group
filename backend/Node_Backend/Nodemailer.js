const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const axios = require("axios"); 

const CLIENT_ID = "659638230860-gdjiamb5lfpd5nfl8kt6alpp223nq108.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "_NEW_REFRESH_TOKEN"; 

async function sendMail() {
  try {
    // OAuth2 Client setup
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "saviourswap@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
        to: recipient,
      subject: data.subject,
      text: data.text || data.message, // Plain text version
      html: data.html || data.message  // HTML version
      },
    });


    const mailOptions = {
      from: "Your Name <saviourswap@gmail.com>",
      to: "recipient@example.com",
      subject: "Test Email",
      text: "Hello, this is a test email!",
    };


    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", result);

   
    const disputeData = {
      senderEmail: "user@example.com",
      recipientEmail: "admin@example.com",
      subject: "Dispute for Order #123",
      message: "I want to dispute this transaction.",
      transactionId: "123",
      reason: "Unauthorized charge",
    };

    // Notify Spring Boot to store the dispute
    const response = await axios.post("http://localhost:8080/transactions/disputes", disputeData);
    console.log("Dispute stored successfully in Spring Boot!", response.data);

  } catch (error) {
    console.error("Error sending email or storing dispute:", error);
  }
}

sendMail();
