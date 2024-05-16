const CSV = require("../models/csvModel");
const CustomError = require("../utils/errorClass");
exports.updateStatus = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { status } = req.body;
    const csv = await CSV.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    console.log(csv, "csv");
    console.log(status, "status");
    res.status(200).json({
      message: "Status updated successfully",
      data: csv,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};
