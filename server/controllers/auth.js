const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/authMiddleware");
const passport = require("passport");
const crypto = require("crypto");
const Token = require("../models/token");
const sendMail = require("./sendMail");
const uploadOnCloudinary = require("../utils/cloudinary");
// const cloudinary = require("../cloudinary.config");

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, password, email, phoneNumber } = req.body;

    let mainImageURL;
    // Check if the email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    if (req.file) {
      const mainImage = req.file;
      console.log(mainImage, "mainImage", "file");
      // const mainImageResult = await cloudinary.uploader.upload(mainImage.path, {
      //   folder: "Assets",
      // });
      const mainImageURL = await uploadOnCloudinary(mainImage.path);
      mainImageURL = mainImageURL.secure_url;
      // console.log(mainImageURL, "mainImageURL");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      phoneNumber,
      image: mainImageURL,
    });

    const savedUser = await newUser.save();

    const token = await new Token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}users/${savedUser._id}/verify/${token.token}`;
    await sendMail(savedUser.email, "Verify your account", url);

    if (!savedUser.verified) {
      let token = await Token.findOne({ userId: savedUser._id });
      if (!token) {
        token = await new Token({
          userId: savedUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}/users/${savedUser.id}/verify/${token.token}`;
        await sendMail(savedUser.email, "Verify Email", url);
      }
      // console.log(savedUser.email, "email");

      return res
        .status(200)
        .send({ message: "An Email sent to your account please verify" });
    }

    res.status(201).json({
      success: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log(user, 'user');

      if (!user) {
        return res.status(401).json({ error: info?.message });
      }
      if(user?.verified == false){
        return res.status(401).json({ error: "Please verify your email" });
      }

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
    }
  )(req, res, next);
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
