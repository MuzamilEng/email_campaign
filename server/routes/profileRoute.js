const express = require("express");
const router = express.Router();
const { createProfile } = require("../controllers/profileController");
// const { getCurrentUser } = require("../controllers/getCurrentUser");
router.route("/createProfile").post(createProfile);

module.exports = router;
