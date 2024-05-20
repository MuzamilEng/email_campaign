const CSV = require("../models/csvModel");
const CustomError = require("../utils/errorClass");
const fs = require('fs');
const csvParser = require('csv-parser');

exports.UploadCsv = async function(req, res) {
  try {
    const { name, startDate, endDate, noOfPoints, message } = req.body;

    // Create a new record
    const campaignRecord = new CSV({
      fileName: req?.file?.originalname,
      filePath: req?.file?.path,
      file: req?.file?.filename,
      name, startDate, endDate, noOfPoints, message,
      status: "Waiting"
    });

    // Save the record to the database
    await campaignRecord.save();

    // Respond with the saved record
    res.status(200).send(campaignRecord);
  } catch (error) {
    console.error('Error in fileController/upload:', error);
    res.status(500).send('Internal server error');
  }
};


/* ------------------ EXPORTING FUNCTION To open file viewer page ------------------ */
module.exports.view = async function(req, res) {
    try {
        // console.log(req.params);
        let csvFile = await CSV.findOne({file: req.params.id});
        // console.log(csvFile);
        const results = [];
        const header =[];
        fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
        .pipe(csvParser())
        .on('headers', (headers) => {
            headers.map((head) => {
                header.push(head);
            });
            // console.log(header);
        })
        .on('data', (data) =>
        results.push(data))
        .on('end', () => {
            // console.log(results.length);
            // console.log(results);
            res.render("file_viewer", {
                title: "File Viewer",
                fileName: csvFile.fileName,
                head: header,
                data: results,
                length: results.length
            });
        });


    } catch (error) {
        console.log('Error in fileController/view', error);
        res.status(500).send('Internal server error');
    }
}

/* ------------------ EXPORTING FUNCTION To delete the file ------------------ */
module.exports.deleteAdminData = async function(req, res) {
  try {
    const csvFile = await CSV.findById(req.params.id);
    console.log(csvFile, "csvFile");
      await  CSV.findByIdAndDelete(req.params.id);
      console.log("File deleted successfully");
      fs.unlink(csvFile?.filePath, (err) => {
          if (err) {
              console.error('Error deleting the file:', err);
              return res.status(500).send('Internal server error');
          }
      });
  } catch (error) {
      console.log('Error in fileController/delete', error);
      return res.status(500).send('Internal server error');
  }
}

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

exports.updateRecord = async function(req, res) {
  const {name, noOfPoints, startDate, endDate, message} = req.body

  try {
    try {
      const csvFile = await CSV.findById(req.params.id);
      console.log(csvFile, "csvFile");
        await  CSV.findByIdAndDelete(req.params.id);
        console.log("File deleted successfully");
        fs.unlink(csvFile?.filePath, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
                return res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return res.status(500).send('Internal server error');
    }
      // console.log(req.file);
      let file = await CSV.create({
          fileName: req.file.originalname,
          filePath: req.file.path,
          file: req.file.filename,
          name, noOfPoints,
          startDate, endDate,
          message, status: "Waiting"
      });
      res.status(200).send('File uploaded successfully.');
    } catch (error) {
      console.log('Error in fileController/upload', error);
      res.status(500).send('Internal server error');
  }
}

/** ------------------ EXPORTING FUNCTION To delete the file ------------------ **/
module.exports.delete = async function(req, res) {
    try {
        // console.log(req.params);
        let isFile = await CSV.findOne({file: req.params.id});

        if(isFile){
            await CSV.deleteOne({file: req.params.id});            
            return res.redirect("/");
        }else{
            console.log("File not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return;
    }
}

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

