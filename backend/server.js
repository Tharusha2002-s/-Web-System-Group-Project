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

// Security Middleware - Disable CSP for local development
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration - Allow all origins for development
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Logging Middleware
app.use(morgan("dev"));

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// STATIC FILE SERVING
// ============================================

console.log("📂 Setting up static file serving...");
console.log("📍 __dirname:", __dirname);

// Serve the ENTIRE frontend folder first
const frontendPath = path.join(__dirname, "../frontend");
console.log("📂 Checking frontend path:", frontendPath);

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log("✅ Serving static files from:", frontendPath);
} else {
  console.error("❌ Frontend directory not found:", frontendPath);
}

// Serve specific subdirectories
const staticPaths = [
  { path: "../frontend/pages", route: "/" },
  { path: "../frontend/css", route: "/css" },
  { path: "../frontend/js", route: "/js" },
  { path: "../frontend/assets", route: "/assets" },
  { path: "../frontend/pages/admin", route: "/admin" },
  { path: "../frontend/pages/vehicle_details", route: "/vehicle_details" },
  { path: "../frontend/pages/rental-booking", route: "/rental-booking" },
];

staticPaths.forEach(({ path: staticPath, route }) => {
  const fullPath = path.join(__dirname, staticPath);
  if (fs.existsSync(fullPath)) {
    app.use(route, express.static(fullPath));
    console.log(`✅ Mounted ${staticPath} at ${route}`);
  } else {
    console.log(`⚠️  Directory not found: ${staticPath}`);
  }
});

// ============================================
// API ROUTES
// ============================================
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
    },
    documentation: "See API documentation for details",
  });
});

// ============================================
// HTML PAGE ROUTES
// ============================================

// Root route - serve Home.html
app.get("/", (req, res) => {
  console.log("🏠 Request for root path received");

  const possiblePaths = [
    path.join(__dirname, "../frontend/pages/Home.html"),
    path.join(__dirname, "../frontend/Home.html"),
    path.join(__dirname, "../pages/Home.html"),
    path.join(__dirname, "../../frontend/pages/Home.html"),
  ];

  console.log("🔍 Searching for Home.html in:");
  for (const filePath of possiblePaths) {
    console.log(`   ${fs.existsSync(filePath) ? "✅" : "❌"} ${filePath}`);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Serving Home.html from: ${filePath}`);
      return res.sendFile(filePath);
    }
  }

  // If no HTML file found
  console.error("❌ Home.html not found in any expected location!");
  res.status(404).json({
    success: false,
    message: "Home.html not found",
    note: "Please check your folder structure",
    searchedPaths: possiblePaths,
    currentDir: __dirname,
  });
});

// ============================================
// ERROR HANDLERS
// ============================================

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("💥 Global Error Handler:", error.message);

  if (error.status === 404 && error.code === "ENOENT") {
    return next();
  }

  res.status(error.status || 500).json({
    success: false,
    message: "Internal server error",
    error: config.NODE_ENV === "development" ? error.message : undefined,
  });
});

// 404 Handler - Must be LAST
app.use((req, res) => {
  console.log("❓ 404 - Not found:", req.path);

  // If it's an API request
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found: " + req.path,
    });
  }

  // For other requests
  res.status(404).json({
    success: false,
    message: "Page not found: " + req.path,
  });
});

// ============================================
// SERVER CLASS
// ============================================

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

      // Setup Database Tables
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
        console.log("🔗 Try accessing:");
        console.log(`   🏠 Homepage:  http://localhost:${this.port}/`);
        console.log(`   📍 API:       http://localhost:${this.port}/api`);
        console.log(
          `   ❤️  Health:   http://localhost:${this.port}/api/health`
        );
        console.log("✨ ========================================");
        console.log("🔗 API Endpoints:");
        console.log(`   📍 POST   /api/auth/register`);
        console.log(`   📍 POST   /api/auth/login`);
        console.log(`   📍 POST   /api/auth/admin-login`);
        console.log(`   📍 GET    /api/vehicles`);
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
