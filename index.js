const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Route to serve contact form
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// Handle form submission
app.post("/send", async (req, res) => {
  const { name, email, phone, location, message } = req.body;

  try {
    // Gmail transporter with App Password
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS  // from .env
      }
    });

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      subject: "New Travel Inquiry",
      text: `You have a new inquiry:

Name: ${name}
Email: ${email}
Phone: ${phone}
Interested Location: ${location}
Message: ${message}`,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    res.json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.error("❌ Email Error:", error);
    res.json({ success: false, message: "Error sending email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
