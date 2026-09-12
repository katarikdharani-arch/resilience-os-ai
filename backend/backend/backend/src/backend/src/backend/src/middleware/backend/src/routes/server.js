const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { initializeFirebase } = require("./firebase");

const usersRoutes = require("./routes/users");
const incidentsRoutes = require("./routes/incidents");
const sosRoutes = require("./routes/sos");
const dashboardRoutes = require("./routes/dashboard");
const businessRoutes = require("./routes/business");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

initializeFirebase();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "RESILIENCE OS AI",
    message: "Business Resilience Backend is running."
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ONLINE",
    service: "RESILIENCE OS AI Backend",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/users", usersRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/business", businessRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log("   RESILIENCE OS AI BACKEND");
  console.log("========================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("========================================");
});
