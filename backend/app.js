require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ── Route modules ─────────────────────────────────────────────────────────────
const logsRoutes = require("./routes/logs.routes");
const analyzeRoutes = require("./routes/analyze.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const queryRoutes = require("./routes/query.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Rate Limiter ──────────────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests. Please try again later.",
    },
});
app.use("/api", limiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🏭 Predictive Maintenance API is running",
        version: "1.0.0",
        services: {
            node_server: `http://localhost:${PORT}`,
            ai_service: process.env.AI_SERVICE_URL || "http://localhost:5000",
        },
        endpoints: {
            logs: "/api/logs",
            analyze: "/api/analyze",
            schedule: "/api/schedule",
            query: "/api/query",
        },
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/logs", logsRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/query", queryRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🏭  Predictive Maintenance API`);
    console.log(`🚀  Node.js server running on http://localhost:${PORT}`);
    console.log(`🤖  AI service expected at ${process.env.AI_SERVICE_URL || "http://localhost:5000"}`);
    console.log(`🌿  Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

module.exports = app;