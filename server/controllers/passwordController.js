const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/token");
const sendMail = require("./sendMail");
// const twilio = require("twilio");

const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Check if the user exists

    // Generate a random OTP
    const otp = generateOTP();

    // Save the OTP in the database

    // Send the OTP to the user's email
    if (email) {
      const user = await User.findOne({ email });
      console.log(user, "user");
      const token = await Token.findOneAndUpdate(
        { userId: user._id },
        { otp: otp },
        { upsert: true }
      );
      console.log(token, "mytoken");

      if (!user) {
        return res
          .status(404)
          .json({ error: "Please enter valid credentials" });
      }
      await sendMail(
        email,
        "Password Reset OTP",
        `Your OTP for password reset is: ${otp}`
      );
    }
    if (phoneNumber) {
      const user = await User.findOne({ phoneNumber });
      const token = await Token.findOneAndUpdate(
        { userId: user._id },
        { otp: otp },
        { upsert: true }
      );
      console.log(token, "mytoken");
      if (!user) {
        return res
          .status(404)
          .json({ error: "Please enter valid credentials" });
      }
      const accountSid = process.env.ACCOUNTSID;
      const authToken = process.env.AUTHTOKEN;
      const client = require("twilio")(accountSid, authToken);

      await client.messages.create({
        body: `Your OTP for password reset is: ${otp}`,
        from: process.env.PHONENUM, // Twilio phone number
        to: phoneNumber,
      });
    }
    res
      .status(200)
      .json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("call reset");
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "Please enter valid credentials" });
    }

    // Check if the OTP is valid
    const token = await Token.findOne({ otp });
    if (!token) {
      return res.status(400).json({ error: "Invalid OTPp" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the OTP token
    await Token.deleteOne({ userId: user._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };
