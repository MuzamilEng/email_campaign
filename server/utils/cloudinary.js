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
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(localPath);

    // Delete the local file after successful upload
    fs.unlinkSync(localPath);

    // Return the secure URL of the uploaded image
    return result.secure_url;
  } catch (err) {
    // Handle errors
    console.error("Error uploading image to Cloudinary:", err);

    // Delete the local file even if upload fails
    if (localPath) {
      fs.unlinkSync(localPath);
    }

    // Throw the error for handling elsewhere if needed
    throw err;
  }
};

module.exports = uploadOnCloudinary;
