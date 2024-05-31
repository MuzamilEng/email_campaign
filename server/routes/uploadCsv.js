const express = require("express");
const router = express.Router();
const {
  UploadCsv,
  getAdminData,
  updateRecord,
  deleteAdminData,
  getOnlyApprovedData,
  getOnlyWaitingData,
  getOnlyRejectData,
} = require("../controllers/handleCsv");
const { upload } = require("../utils/multer");
const { getCurrentUser } = require("../controllers/getCurrentUser");
const { authenticateJWT } = require("../middleware/authMiddleware");
router.route("/upload").post(upload.single("dataFile"), UploadCsv);
router.route("/getAdminData").get(getAdminData);
router.route("/updateRecord/:id").put(upload.single("file"), updateRecord);
router.route("/deleteRecord/:id").delete(deleteAdminData);
router.route("/getOnlyApprovedData").get(getOnlyApprovedData);
router.route("/getOnlyWaitingData").get(getOnlyWaitingData);
router.route("/getOnlyRejectData").get(getOnlyRejectData);
router.route("/getCurrentUser").get(authenticateJWT, getCurrentUser);
module.exports = router;
