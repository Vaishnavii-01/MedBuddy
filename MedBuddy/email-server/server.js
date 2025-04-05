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
const serviceAccount = JSON.parse(fs.readFileSync("./firebase-admin.json", "utf8"));

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
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// API Route to trigger email manually
app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

// Function to check and send scheduled medication reminders
const checkScheduledEmails = async () => {
  console.log("🔍 Checking for scheduled emails...");

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  // Fetch medicines collection
  const medicineDocs = await db.collection("medicines").get();

  medicineDocs.forEach(async (doc) => {
    const data = doc.data();

    console.log(`🔍 Checking medicine reminder for: ${data.medicineName} at ${currentTime}`);

    if (!data.userId) {
      console.error("❌ userId is missing in the medicine document.");
      return;
    }

    // Fetch user document from the users collection
    const userDoc = await db.collection("users").doc(data.userId).get();

    if (!userDoc.exists) {
      console.error(`❌ No user found for userId: ${data.userId}`);
      return;
    }

    const userEmail = userDoc.data().email;

    if (!userEmail) {
      console.error(`❌ No email found for userId: ${data.userId}`);
      return;
    }

    // Check if the medicine reminder time matches the current time
    if (data.timesArray && data.timesArray.includes(currentTime)) {
      console.log(`📧 Sending reminder email to: ${userEmail}`);

      try {
        await sendEmail(userEmail, "Medication Reminder", `Take your medicine: ${data.medicineName}`);
        console.log("✅ Email sent successfully");
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    }
  });
};

// Run the function every minute
setInterval(checkScheduledEmails, 60000);

// Automated Scheduler - Runs every minute using cron
cron.schedule("* * * * *", async () => {
  console.log("⏳ Running scheduled medication reminder check...");

  const now = new Date();
  now.setHours(now.getHours() + 5); // Convert to IST (UTC +5:30)
  now.setMinutes(now.getMinutes() + 30);
  const currentTime = now.toISOString().slice(11, 16); // Extract HH:MM format

  const snapshot = await db.collection("medicines").get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();

    if (data.timesArray && data.timesArray.includes(currentTime)) {
      if (!data.userId) {
        console.error("❌ userId is missing in the medicine document.");
        return;
      }

      // Fetch user document
      const userDoc = await db.collection("users").doc(data.userId).get();

      if (!userDoc.exists) {
        console.error(`❌ No user found for userId: ${data.userId}`);
        return;
      }

      const userEmail = userDoc.data().email;

      if (!userEmail) {
        console.error(`❌ No email found for userId: ${data.userId}`);
        return;
      }

      console.log(`📧 Sending scheduled reminder email to: ${userEmail}`);
      try {
        await sendEmail(userEmail, "Medication Reminder", `Take your medicine: ${data.medicineName}`);
        console.log("✅ Scheduled email sent successfully");
      } catch (error) {
        console.error("❌ Error sending scheduled email:", error);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
