import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import cron from "node-cron";
import dotenv from "dotenv";
import fs from "fs";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-admin.json", "utf8")
);
//import serviceAccount from "./firebase-admin.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Function to send an email
const sendEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// API Route to trigger email manually
app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Automated Scheduler - Runs every minute to check Firestore for scheduled emails
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Checking for scheduled emails...", now);

  const snapshot = await db.collection("medications")
    .where("time", "<=", now.toISOString()) // Fetch medications due now
    .get();

  snapshot.forEach((doc) => {
    const data = doc.data();
    sendEmail(data.email, "Medication Reminder", `Take your medicine: ${data.medicineName}`);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
