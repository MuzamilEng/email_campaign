const express = require("express")
const router = express.Router()
const { createProfile } = require("../controllers/profileController")
router.route('/createProfile').post(createProfile)
module.exports = router