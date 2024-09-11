const CSV = require("../models/csvModel");
const CustomError = require("../utils/errorClass");
const User = require("../models/User");

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const csv = await CSV.findByIdAndUpdate(id, { status: status }, { new: true });

    res.status(200).json({
      message: "Status updated successfully",
      data: csv,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};
exports.uploadReport = async (req, res, next) => {
  try {
    const { csvId } = req.body;

    const file = req.file;

    const csv = await CSV.findById({ _id: csvId });

    if (!file) {
      return res.status(400).json({
        message: "Report not uploaded",
      });
    }
    csv.reportFile = file.filename;
    await csv.save();
    res.status(200).json({
      message: "Report uploaded successfully",
      data: csv,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};
