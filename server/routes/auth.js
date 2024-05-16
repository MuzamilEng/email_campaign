const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { signUp, login, getUserDetails, allUsers,} = require("../controllers/auth");
const User = require("../models/User");
const Token = require("../models/token");
const storage = multer.diskStorage({
  // destination: ('./public/uploads/'),
  filename: (req, file, cb) => {
    cb( null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});

const uploadFiles = upload.single("image");

router.route("/signup").post(uploadFiles, signUp);
router.route("/login").post(login);
router.route("/getDetails").get(getUserDetails);
router.route("/getAllUsers").get(allUsers);

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link " });
    // console.log(user._id);

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log(token, "mytoken");
    if (!token) return res.status(400).send({ message: "Invalid link" });

    // Remove the token field from the token document
    // await Token.updateOne({ _id: token._id }, { $unset: { token: 1 } });

    // Update user's verification status
    await User.updateOne({ _id: user._id }, { verified: true });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
