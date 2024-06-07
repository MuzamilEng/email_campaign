const CSV = require("../models/csvModel");
const CustomError = require("../utils/errorClass");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = require("../models/User");
const Invoice = require("../models/invoices");
exports.UploadCsv = async function (req, res) {
  try {
    const { name, noOfPoints, id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const campaignRecord = new CSV({
      fileName: req?.file?.originalname,
      filePath: req?.file?.path,
      file: req?.file?.filename,
      name,
      noOfPoints,
      status: "Waiting",
    });

    // Save the record to the database
    await campaignRecord.save();
    // const formattedTimestamp = dayjs().format("MMMM D, YYYY");
    // user.totalInvoices.push({
    //   fileName: req?.file?.originalname,
    //   timeStamps: formattedTimestamp,
    // });

    // // Respond with the saved record and filename
    // await user.save();
    res.status(200).json({
      campaignRecord,
      fileName: req?.file?.originalname, // Include the filename in the response
    });
  } catch (error) {
    // console.error("Error in fileController/upload:", error);
    res.status(500).send("Internal server error");
  }
};

exports.Invoice = async function (req, res) {
  try {
    const invoiceRecord = new Invoice({
      fileName: req?.file?.originalname,
      filePath: req?.file?.path,
      file: req?.file?.filename,
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
      return next(new CustomError('No invoices found', 404));
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
    // console.log(req.params);
    let csvFile = await CSV.findOne({ file: req.params.id });
    // console.log(csvFile);
    const results = [];
    const header = [];
    fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
      .pipe(csvParser())
      .on("headers", (headers) => {
        headers.map((head) => {
          header.push(head);
        });
        // console.log(header);
      })
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // console.log(results.length);
        // console.log(results);
        res.render("file_viewer", {
          title: "File Viewer",
          fileName: csvFile.fileName,
          head: header,
          data: results,
          length: results.length,
        });
      });
  } catch (error) {
    console.log("Error in fileController/view", error);
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

exports.getAdminData = async (req, res, next) => {
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
    const csv = await CSV.findByIdAndUpdate(
      req.params.id,
      { name, date, time },
      { new: true }
    );

    // Check if CSV document exists
    if (!csv) {
      return res
        .status(404)
        .json({ success: false, message: "CSV data not found" });
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
exports.getOnlyApprovedData = async (req, res, next) => {
  try {
    const data = await CSV.find({ status: "Approved" });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Data not found",
    });
  }
};
exports.getOnlyRejectData = async (req, res, next) => {
  try {
    const data = await CSV.find({ status: "Reject" });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Data not found",
    });
  }
};
exports.getOnlyWaitingData = async (req, res, next) => {
  try {
    const data = await CSV.find({ status: "Waiting" });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Data not found",
    });
  }
};
