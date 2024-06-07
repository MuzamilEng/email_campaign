const mongoose = require("mongoose");
const csvSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath: String,
    file: String,
    name: String,
    noOfPoints: String,
    status: {
      type: String,
      default: "Waiting",
    },
    reportFile: {
      type: String,
    },
  },
  { timestamps: true }
);
const Csv = mongoose.model("Csv", csvSchema);
module.exports = Csv;
