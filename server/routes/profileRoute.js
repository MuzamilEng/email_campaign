const express = require("express");
const router = express.Router();
const { createProfile } = require("../controllers/profileController");
const { updateProfile } = require("../controllers/auth");
// const { getCurrentUser } = require("../controllers/getCurrentUser");
router.route("/createProfile").post(createProfile);
router.route("/update-profile").put(updateProfile);
module.exports = router;
