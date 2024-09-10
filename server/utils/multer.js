const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Helper function to create the directory if it doesn't exist
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, "public/temp");

    // Ensure the directory exists
    ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Get current timestamp
    const randomString = Math.random().toString(36).substring(2, 15); // Generate random string
    const uniqueFilename = `${timestamp}-${randomString}-${file.originalname}`; // Combine timestamp, random string, and original filename
    cb(null, uniqueFilename);
  },
});

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, "public/temp");

    // Ensure the directory exists
    ensureDirectoryExists(destinationPath);

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const timestamp = Date.now(); // Get current timestamp
    const randomString = Math.random().toString(36).substring(2, 15); // Generate random string
    const uniqueFilename = `${timestamp}-${randomString}-${file.originalname}`; // Combine timestamp, random string, and original filename
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });
const uploadFile = multer({ storage: reportStorage });

module.exports = { upload, uploadFile };
