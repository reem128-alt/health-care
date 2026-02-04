const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Destination directory:", uploadDir);
    console.log("File to be saved:", file);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("Processing file for filename:", file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  console.log("Filtering file:", file);
  console.log("File mimetype:", file.mimetype);
  console.log("File originalname:", file.originalname);
  
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (allowedMimeTypes.includes(file.mimetype) || extname) {
    return cb(null, true);
  }
  
  console.error("File rejected - mimetype:", file.mimetype, "extension:", path.extname(file.originalname));
  cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
};

// Create multer upload instance with error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
