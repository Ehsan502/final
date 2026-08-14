import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { initSocket } from "./socket/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

import Session from "./models/Session.js";
import { createNotification } from "./utils/notify.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🟢 Updated Allowed Origins (Localhost + Both Netlify URLs)
const allowedOrigins = [
  "http://localhost:5173",
  "https://finalap.netlify.app", // 👈 Added your current active Netlify domain
  "https://dynamic-mousse-50260f.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

initSocket(server, allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all during production testing
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// 🟢 ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "SkillSwap API is running live on Vercel! 🚀",
  });
});

// 🟢 HEALTH CHECK ROUTE
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SkillSwap API running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Cron job for local development
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 25 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 45 * 60 * 1000);

    const upcoming = await Session.find({
      status: "scheduled",
      reminderSent: false,
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
    });

    for (const session of upcoming) {
      await createNotification({
        user: session.organizer,
        type: "session_reminder",
        text: `Reminder: "${session.title}" starts soon`,
        link: "/schedule",
        relatedId: session._id,
      });
      await createNotification({
        user: session.participant,
        type: "session_reminder",
        text: `Reminder: "${session.title}" starts soon`,
        link: "/schedule",
        relatedId: session._id,
      });
      session.reminderSent = true;
      await session.save();
    }
  } catch (err) {
    console.error("Reminder cron error:", err.message);
  }
});

// Local listening check
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`SkillSwap server running on port ${PORT}`);
  });
}

export default app;