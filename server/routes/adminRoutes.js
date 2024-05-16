const express = require("express");
const router = express.Router();
const { updateStatus } = require("../controllers/admin");
router.route("/updateStatus/:id").put(updateStatus);
module.exports = router;
