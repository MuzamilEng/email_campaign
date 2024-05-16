const mongoose = require("mongoose");
const csvSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath : String,
    file: String,
    name: String,
    status: {
      type: String,
      default: "Waiting",
    },
  },
  { timestamps: true }
);
const Csv = mongoose.model("Csv", csvSchema);
module.exports = Csv;
