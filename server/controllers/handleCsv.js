const CSV = require("../models/csvModel");
const CustomError = require("../utils/errorClass");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = require("../models/User");
const Invoice = require("../models/invoices");
const uploadOnCloudinary = require("../utils/cloudinary");
const path = require("path");

exports.Invoice = async function (req, res) {
  try {
    const fileOnCloudinary = await uploadOnCloudinary(req.file.path);
    // console.log(fileOnCloudinary, "file on cloudinary hudson upload");
    const invoiceRecord = new Invoice({
      fileName: req?.file?.originalname,
      filePath: req?.file?.path,
      file: fileOnCloudinary,
    });
    // Save the record to the database
    await invoiceRecord.save();
    res.status(200).json({
      invoiceRecord,
      fileName: req?.file?.originalname, // Include the filename in the response
    });
  } catch (error) {
    // console.error("Error in fileController/upload:", error);
    res.status(500).send("Internal server error");
  }
};
exports.getInvoicesDetails = async (req, res, next) => {
  try {
    const latestInvoice = await Invoice.findOne().sort({ updatedAt: -1 });

    if (!latestInvoice) {
      return next(new CustomError("No invoices found", 404));
    }

    res.status(200).json({
      success: true,
      data: latestInvoice,
    });
  } catch (err) {
    console.log(err.message);
    return next(new CustomError(err.message, 500));
  }
};
/* ------------------ EXPORTING FUNCTION To open file viewer page ------------------ */

module.exports.view = async function (req, res) {
  try {
    let csvFile = await CSV.findOne({ file: req.params.id });
    if (!csvFile) {
      return res.status(404).send("CSV file not found");
    }

    const results = [];
    const headers = [];

    fs.createReadStream(csvFile.filePath)
      .pipe(csvParser())
      .on("headers", (headers) => {
        headers.forEach((head) => {
          headers.push(head);
        });
      })
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const fields = headers;
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(results);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${csvFile.fileName}"`);
        res.status(200).send(csv);
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        res.status(500).send("Error parsing CSV file");
      });
  } catch (error) {
    console.error("Error in fileController/view", error);
    res.status(500).send("Internal server error");
  }
};

exports.UploadCsv = async function (req, res) {
  try {
    const { id, name, noOfPoints } = req.body;
    console.log(id, "upload id");
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the CSV file to Cloudinary
    const filePath = path.resolve(req.file.path);
    console.log("filePath:", filePath);
    const cloudinaryUrl = await uploadOnCloudinary(filePath);
    console.log("Cloudinary URL:", cloudinaryUrl);

    if (!cloudinaryUrl) {
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }

    // Save the Cloudinary URL and other file info to the database
    const campaignRecord = new CSV({
      userId: id,
      file: cloudinaryUrl,
      name,
      noOfPoints,
      status: "Waiting",
    });

    // Save the record to the database
    await campaignRecord.save();

    res.status(200).json({
      campaignRecord,
      fileName: req.file.originalname,
      cloudinaryUrl: cloudinaryUrl,
    });
  } catch (error) {
    console.error("Error in fileController/UploadCsv:", error);
    res.status(500).send("Internal server error");
  }
};
/* ------------------ EXPORTING FUNCTION To delete the file ------------------ */
module.exports.deleteAdminData = async function (req, res) {
  try {
    const csvFile = await CSV.findById(req.params.id);
    console.log(csvFile, "csvFile");
    await CSV.findByIdAndDelete(req.params.id);
    console.log("File deleted successfully");
    fs.unlink(csvFile?.filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
        return res.status(500).send("Internal server error");
      }
    });
  } catch (error) {
    console.log("Error in fileController/delete", error);
    return res.status(500).send("Internal server error");
  }
};

// exports.getAdminData = async (req, res, next) => {
//   try {
//     const csv = await CSV.find();
//     res.status(200).json({
//       success: true,
//       data: csv,
//     });
//   } catch (err) {
//     console.log(err.message);
//     return next(new CustomError(err.message, 500));
//   }
// };

exports.updateRecord = async function (req, res) {
  const { name, noOfPoints } = req.body;

  try {
    try {
      const csvFile = await CSV.findById(req.params.id);
      console.log(csvFile, "csvFile");
      await CSV.findByIdAndDelete(req.params.id);
      console.log("File deleted successfully");
      fs.unlink(csvFile?.filePath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
          return res.status(500).send("Internal server error");
        }
      });
    } catch (error) {
      console.log("Error in fileController/delete", error);
      return res.status(500).send("Internal server error");
    }
    // console.log(req.file);
    let file = await CSV.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      file: req.file.filename,
      name,
      noOfPoints,
      status: "Waiting",
    });
    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.log("Error in fileController/upload", error);
    res.status(500).send("Internal server error");
  }
};

/** ------------------ EXPORTING FUNCTION To delete the file ------------------ **/
module.exports.delete = async function (req, res) {
  try {
    // console.log(req.params);
    let isFile = await CSV.findOne({ _id: req.params.id });

    if (isFile) {
      await CSV.deleteOne({ _id: req.params.id });
      // return res.redirect("/");
      return res.status(200).send("File deleted successfully");
    }
  } catch (error) {
    // console.log("Error in fileController/delete", error);
    return res.status(500).json("message", error.message);
  }
};

exports.updateAdminData = async (req, res, next) => {
  try {
    const { name, date, time } = req.body;
    const csv = await CSV.findByIdAndUpdate(req.params.id, { name, date, time }, { new: true });

    // Check if CSV document exists
    if (!csv) {
      return res.status(404).json({ success: false, message: "CSV data not found" });
    }

    // Send success response with updated CSV data
    res.status(200).json({ success: true, data: csv });
  } catch (err) {
    // Handle internal server error
    console.error("Error updating CSV data:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminData = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id, "client id");
    const csv = await CSV.find({ userId: id });
    res.status(200).json({
      success: true,
      data: csv,
    });
  } catch (err) {
    console.log(err.message);
    return next(new CustomError(err.message, 500));
  }
};
exports.getAdminRecords = async (req, res, next) => {
  try {
    const csv = await CSV.find();
    res.status(200).json({
      success: true,
      data: csv,
    });
  } catch (err) {
    console.log(err.message);
    return next(new CustomError(err.message, 500));
  }
};
