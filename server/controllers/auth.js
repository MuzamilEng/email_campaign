// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/authMiddleware");
const passport = require("passport");
const crypto = require("crypto");
const Token = require("../models/token");
const sendMail = require("./sendMail");
const uploadOnCloudinary = require("../utils/cloudinary");
const bcrypt = require("bcrypt");
// const cloudinary = require("../cloudinary.config");
const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signUp = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstName, lastName, password, email, phoneNumber, penCardNumber } = req.body;
    // console.log(phoneNumber, "phone number");
    // Check for missing fields
    if (!firstName || !lastName || !password || !email || !phoneNumber || !penCardNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate email format (optional, based on your requirements)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Upload image to Cloudinary (if included in request)
    let mainImageURL;
    if (req.file) {
      try {
        const mainImage = req.file;
        const mainImageResult = await uploadOnCloudinary(mainImage.path); // Replace with your cloudinary upload function
        mainImageURL = mainImageResult.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ error: "Error uploading image" });
      }
    }

    // Hash the password with a secure salt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    // const otp = generateOTP();

    // Send OTP using Twilio (if configured)
    const accountSid = process.env.ACCOUNTSID;
    const authToken = process.env.AUTHTOKEN;
    const client = require("twilio")(accountSid, authToken);

    await client.messages.create({
      body: `You have been registered successfully to WAHIX INDIA `,
      from: process.env.PHONEMUN, // Twilio phone number
      to: phoneNumber,
    });

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      phoneNumber,
      penCardNumber,
      // image: mainImageURL,
    });

    const savedUser = await newUser.save();

    // Generate and save verification token
    const token = await new Token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    // Create verification URL
    // const url = `${process.env.BASE_URL}/users/${savedUser._id}/verify/${token.token}`;

    // Send verification email
    // await sendMail(savedUser.email, "Verify your account", url);

    // Return successful response with verification message
    return res.status(200).send({
      // message: "An email has been sent to your account for verification.",
      user: {
        firstName: savedUser?.firstName,
        lastName: savedUser?.lastName,
        email: savedUser?.email,
        phoneNumber: savedUser?.phoneNumber,
        // ... (include other non-sensitive fields)
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    console.log(req.body, "body");
    return res.status(500).json({ error: "Internal server error" }); // Avoid leaking specific error messages
  }
};

module.exports = signUp;

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(user, "user");

    if (!user) {
      return res.status(401).json({ error: info?.message });
    }
    // if (user?.verified == false) {
    //   return res.status(401).json({ error: "Please verify your email" });
    // }

    try {
      // Generate and sign a JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        "JSONWEBTOKKENSECRETKEY!@#$%^&*()",
        {
          expiresIn: "12d",
        }
      );

      return res.json({ token, user });
    } catch (error) {
      console.error("Error retrieving profile:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  })(req, res, next);
};

const getUserDetails = (req, res) => {
  console.log(req.body, "token here");
  authenticateJWT(req, res, async () => {
    const user = req.user;
    return res.json(user);
  });
};

const allUsers = async (req, res) => {
  console.log(req.query, "query");
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const profiles = await User.find(keyword).find({
      _id: { $ne: req?.user?._id },
    });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  getUserDetails,
  allUsers,
};
