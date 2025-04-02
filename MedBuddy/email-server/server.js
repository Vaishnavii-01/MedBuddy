import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON request body parsing

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password
  },
});

// Route to send email instantly (for testing)
app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cron Job to send scheduled email reminders (Runs every day at 9 AM)
cron.schedule("0 9 * * *", async () => {
  console.log("Sending scheduled email reminders...");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "user@example.com", // Replace with user email from database
    subject: "Medication Reminder",
    text: "This is your daily medication reminder!",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reminder Email Sent Successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
