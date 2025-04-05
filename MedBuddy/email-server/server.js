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

const serviceAccount = JSON.parse(fs.readFileSync("./firebase-admin.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">💊 Medication Reminder</h2>
          <p>Hello!</p>
          <p>This is a gentle reminder to take your medicine:</p>
          <p style="font-size: 18px; font-weight: bold;">${message}</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #555;">Stay healthy!<br>– Your MedBuddy 🤖</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

const checkScheduledEmails = async () => {
  console.log("🔍 Checking for scheduled emails...");

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  const medicineDocs = await db.collection("medicines").get();

  medicineDocs.forEach(async (doc) => {
    const data = doc.data();

    console.log(`🔍 Checking medicine reminder for: ${data.medicineName} at ${currentTime}`);

    if (!data.userId) {
      console.error("❌ userId is missing in the medicine document.");
      return;
    }

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

setInterval(checkScheduledEmails, 60000);

cron.schedule("* * * * *", async () => {
  console.log("⏳ Running scheduled medication reminder check...");

  const now = new Date();
  now.setHours(now.getHours() + 5); 
  now.setMinutes(now.getMinutes() + 30);
  const currentTime = now.toISOString().slice(11, 16); 

  const snapshot = await db.collection("medicines").get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();

    if (data.timesArray && data.timesArray.includes(currentTime)) {
      if (!data.userId) {
        console.error("❌ userId is missing in the medicine document.");
        return;
      }

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