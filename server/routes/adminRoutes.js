const express = require("express");
const router = express.Router();
const { updateStatus, uploadReport } = require("../controllers/admin");
const { uploadFile } = require("../utils/multer");
router.route("/updateStatus/:id").put(updateStatus);
router.route("/uploadReport").post(uploadFile.single("reportFile"), uploadReport);
module.exports = router;
