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
      "https://blog-seven-sigma-81.vercel.app",
      "https://blog-frontend-1-97ay.onrender.com"
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

app.listen(5000, () => {
  console.log("server is running");
});
