const express = require("express");
const router = express.Router();
const {
  UploadCsv,
  getAdminData,
  updateRecord,
  deleteAdminData,
  Invoice,
  getInvoicesDetails,
  getAdminRecords,
} = require("../controllers/handleCsv");
const { upload } = require("../utils/multer");
const { getCurrentUser } = require("../controllers/getCurrentUser");
const { authenticateJWT } = require("../middleware/authMiddleware");
router.route("/upload").post(upload.single("dataFile"), UploadCsv);
router.route("/uploadInvoice").post(upload.single("invoiceDetail"), Invoice);
router.route("/getAdminData/:id").get(getAdminData);
router.route("/updateRecord/:id").put(upload.single("file"), updateRecord);
router.route("/deleteRecord").delete(deleteAdminData);
router.route("/getInvoicesDetails").get(getInvoicesDetails);
router.route("/getCurrentUser").get(authenticateJWT, getCurrentUser);
router.route("/getAdminRecords").get(getAdminRecords);
module.exports = router;
