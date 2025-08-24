// api/send.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, location, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      subject: "New Travel Inquiry",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Interested Location: ${location}
        Message: ${message}
      `,
      replyTo: email,
    });

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error sending email." });
  }
}
