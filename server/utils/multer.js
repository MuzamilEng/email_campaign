const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, "../../client/public/csv");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
