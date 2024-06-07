const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath: String,
    file: String,
  },
  { timestamps: true }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
