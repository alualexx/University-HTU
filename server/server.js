const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/colleges", require("./routes/colleges"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/research", require("./routes/research"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/tuition", require("./routes/tuition"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/transcripts", require("./routes/transcripts"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/system", require("./routes/system"));
app.use("/api/activity-logs", require("./routes/activity_logs"));
app.use("/api/security-logs", require("./routes/security_logs"));
app.use("/api/password-resets", require("./routes/password_resets"));
app.use("/api/system-broadcasts", require("./routes/system_broadcasts"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "University API Server is running." });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
