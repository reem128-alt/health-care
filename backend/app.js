const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const path = require("path");
const doctorRoute = require("./routes/doctorRoute");
const blogRoute = require("./routes/blogRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
dbConnect();

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://health-care-qw9j.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
  })
);

// Serve static files
const uploadsPath = path.join(__dirname, "uploads");
// Ensure uploads directory exists
if (!require('fs').existsSync(uploadsPath)) {
  require('fs').mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));
app.use("/", express.static(path.join(__dirname, "public")));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/doctors", doctorRoute);
app.use("/blogs", blogRoute);
app.use("/appointments", appointmentRoute);

// Global error handler middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Set status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send JSON response instead of HTML
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(5000, () => {
  console.log("server is running");
});
