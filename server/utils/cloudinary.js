require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }

    // Upload the file to Cloudinary as raw resource
    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "raw", // Specify 'raw' for non-image files
    });

    // Delete the local file after successful upload
    fs.unlinkSync(localPath);

    // Return the secure URL of the uploaded file
    return result.secure_url;
  } catch (err) {
    // Handle errors
    console.error("Error uploading file to Cloudinary:", err);

    // Delete the local file even if upload fails
    if (localPath) {
      fs.unlinkSync(localPath);
    }

    // Throw the error for handling elsewhere if needed
    throw err;
  }
};

module.exports = uploadOnCloudinary;
