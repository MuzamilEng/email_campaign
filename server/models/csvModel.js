const mongoose = require("mongoose");
const csvSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath : String,
    file: String,
    name: String,
    startDate: String,
    endDate: String,
    noOfPoints: String,
    message: String,
    status: {
      type: String,
      default: "Waiting",
    },
  },
  { timestamps: true }
);
const Csv = mongoose.model("Csv", csvSchema);
module.exports = Csv;
