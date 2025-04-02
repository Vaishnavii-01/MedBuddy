import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync("firebase-admin.json", "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 🔹 Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 **API Route to Save User Reminder Data**
app.post("/set-reminder", async (req, res) => {
  const { email, name, medicineName, reminderTime } = req.body;

  try {
    await db.collection("users").doc(email).set({
      email,
      name,
      medicineName,
      reminderTime, // Format: "HH:mm" (24-hour format)
    });

    res.json({ success: true, message: "Reminder set successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📌 **Function to Fetch Users & Send Emails at Their Specific Times**
const scheduleUserReminders = async () => {
  const usersSnapshot = await db.collection("users").get();
  
  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    const { email, name, medicineName, reminderTime } = userData;
    
    const [hour, minute] = reminderTime.split(":");
    
    const cronSchedule = `${minute} ${hour} * * *`; // Converts to Cron format

    cron.schedule(cronSchedule, async () => {
      console.log(`Sending email to ${email} at ${reminderTime}...`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Medication Reminder",
        text: `Hello ${name}, it's time to take your medicine: ${medicineName}!`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
      }
    });
  });
};

// 🔹 Schedule Emails at Server Startup
scheduleUserReminders();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



/*
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
*/