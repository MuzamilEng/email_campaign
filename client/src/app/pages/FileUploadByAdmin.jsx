import React, { useState, useEffect, useRef } from "react";
import Layout from "../Layout/Layout";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useUploadReportMutation } from "../store/storeApi";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";


const FileUploadByAdmin = () => {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const ref = useRef();
  const [selectedFile, setSelectedFile] = useState();
  const [uploadReport, { isLoading, isError, data, isSuccess }] = useUploadReportMutation();
  const handleUploadFile = async () => {
    const formData = new FormData();
    if (!selectedFile) return toast.error("Please select a file");
    formData.append("invoiceDetail", selectedFile);
    uploadReport(formData);
    setIsModalOpen(false);
    setSelectedFile(null);
  };
  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  if (isSuccess) {
    toast.success("File uploaded successfully", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsModalOpen(false);
    setSelectedFile(null);
    navigate("/adminTable");

  }

  return (
    <Layout>
      <Toaster />

      <Box
        sx={{
          position: "absolute",
          width: 400,
          bgcolor: "background.paper", // Use theme-based background color
          boxShadow: 24,
          p: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: 4,
        }}
      >
        <input type="file" ref={ref} onChange={handleFileInputChange} hidden />
        <label htmlFor="file-upload">
          <Button
            component="span"
            color="primary"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => ref.current.click()}
            fullWidth
            sx={{
              mb: 2, // Add margin bottom for spacing
              borderStyle: "dashed", // Set border style to dashed
              borderColor: "primary.main", // Set border color to primary color
              borderWidth: 2, // Set border width
              borderRadius: 4, // Optional: Set border radius
              padding: "7vw", // Adjust padding as needed
            }}
          >
            Choose File
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: "bold" }}>
          Selected file:
          {/* Show selected file name */}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Upload">
            <Button
              onClick={handleUploadFile}
              color="primary"
              variant="contained"
              disabled={isLoading}
              startIcon={<CloudUploadIcon />}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Layout>
  );
};

export default FileUploadByAdmin;
