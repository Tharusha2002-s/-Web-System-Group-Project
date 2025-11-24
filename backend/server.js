// ============================================
// server.js - Server Entry Point (FULLY FIXED)
// ============================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const database = require("./config/db");
const setupDatabase = require("./database/setupDatabase");
const config = require("./config/config");

// Create Express app
const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5501', 'http://127.0.0.1:5501'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Logging Middleware
app.use(morgan("combined"));

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve Static Files from correct directories
const staticPaths = [
  "../", // Root directory
  "../pages", // Pages directory
  "../admin", // Admin directory
  "../vehicles", // Vehicles directory
];

staticPaths.forEach((staticPath) => {
  const fullPath = path.join(__dirname, staticPath);
  if (fs.existsSync(fullPath)) {
    app.use(express.static(fullPath));
    console.log(`✅ Serving static files from: ${staticPath}`);
  } else {
    console.log(`⚠️  Directory not found: ${staticPath}`);
  }
});

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/vehicles", require("./routes/vehicle.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running healthy",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: "1.0.0",
  });
});

// API Welcome Route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Reliant Rental API Server",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      users: "/api/users",
      vehicles: "/api/vehicles",
      bookings: "/api/bookings",
      payments: "/api/payments",
      contact: "/api/contact",
    },
    documentation: "See API documentation for details",
  });
});

// Serve specific HTML files for common routes
app.get("/", (req, res) => {
  const possiblePaths = [
    path.join(__dirname, "../Home.html"),
    path.join(__dirname, "../index.html"),
    path.join(__dirname, "../pages/Home.html"),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // If no HTML file found, return API info
  res.json({
    success: true,
    message: "Reliant Rental Backend API is running",
    note: "Frontend files not found in expected locations",
    api_endpoints: "Use /api for available endpoints",
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("💥 Global Error Handler:", error.message);

  // Don't log 404 errors for static files
  if (error.status === 404 && error.code === "ENOENT") {
    return next();
  }

  res.status(error.status || 500).json({
    success: false,
    message: "Internal server error",
    error: config.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Catch-all handler - MUST BE LAST
app.use((req, res) => {
  // If it's an API request that reached here, return 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found: " + req.path,
    });
  }

  // Try to serve the requested file
  const requestedPath = req.path === "/" ? "/Home.html" : req.path;
  const possiblePaths = [
    path.join(__dirname, "..", requestedPath),
    path.join(__dirname, "../pages", requestedPath),
    path.join(__dirname, "../admin", requestedPath),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // If file not found, return simple 404 message
  res.status(404).json({
    success: false,
    message: "Endpoint not found: " + req.path,
    note: "This is a backend API server. Frontend should be served separately.",
  });
});

class Server {
  constructor() {
    this.app = app;
    this.port = config.PORT;
    this.server = null;
  }

  async start() {
    try {
      console.log("🚀 Starting Reliant Rental Server...");
      console.log("📍 Environment:", config.NODE_ENV);

      // Connect to Database
      console.log("📊 Connecting to MySQL Database...");
      await database.connect();

      // Setup Database Tables (with updated vehicles table)
      console.log("🗃️ Setting up database schema...");
      await setupDatabase.setupTables();

      // Start HTTP Server
      this.server = this.app.listen(this.port, () => {
        console.log("✨ ========================================");
        console.log("✅ Reliant Rental Server Started Successfully!");
        console.log("✨ ========================================");
        console.log(`🌐 Server URL: http://localhost:${this.port}`);
        console.log(`📊 Environment: ${config.NODE_ENV}`);
        console.log(`🕒 Started at: ${new Date().toISOString()}`);
        console.log("✨ ========================================");
        console.log("🔗 Available API Endpoints:");
        console.log(
          `   📍 POST   http://localhost:${this.port}/api/auth/register`
        );
        console.log(
          `   📍 POST   http://localhost:${this.port}/api/auth/login`
        );
        console.log(
          `   📍 POST   http://localhost:${this.port}/api/auth/admin-login`
        );
        console.log(`   📍 GET    http://localhost:${this.port}/api/admin`);
        console.log(`   📍 GET    http://localhost:${this.port}/api/vehicles`);
        console.log(`   📍 GET    http://localhost:${this.port}/api/health`);
        console.log("✨ ========================================");
        console.log("👤 Default Admin Login:");
        console.log(`   📧 Email: admin@reliantrental.com`);
        console.log(`   🔑 Password: admin123`);
        console.log("✨ ========================================");
      });

      this.setupGracefulShutdown();
    } catch (error) {
      console.error("💥 Failed to start server:", error.message);
      process.exit(1);
    }
  }

  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      try {
        if (this.server) {
          this.server.close(() => {
            console.log("✅ HTTP server closed");
          });
        }

        await database.close();
        console.log("✅ Database connection closed");
        process.exit(0);
      } catch (error) {
        console.error("💥 Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}

// Start the server
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server;
