import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TablePagination,
  Tooltip,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { useUploadReportMutation } from "../store/storeApi";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "../context/GlobalStateProvider";

const ActionButton = styled(Button)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "10px",
  borderBottom: "1px solid #e0e0e0",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme?.palette?.action?.hover,
  },
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

function AdminTable({
  globalAdminData,
  updateStatus,
  handleDownload,
  formatDate,
  removeInitialPath,
  isUpdating,
  isDeleting,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvId, setCsvId] = useState(null);
  const ref = useRef();
  const [uploadReport, { isLoading, isError, data, isSuccess }] =
    useUploadReportMutation();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const { userReport, setUserReport } = useGlobalContext();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUploadFile = async () => {
    console.log("Uploading file:", selectedFile);
    const formData = new FormData();
    formData.append("csvId", csvId);
    formData.append("reportFile", selectedFile);
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
  }
  useEffect(() => {
    let id = JSON.parse(localStorage.getItem("csvData"));
    setCsvId(id?._id);
  }, []);

  return (
    <>
      <Toaster />
      <Paper className="mt-[2vw] shadow rounded">
        <TableContainer>
          <Table className="w-full">
            <TableHead className="bg-gray-200">
              <TableRow>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Check
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Name
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Created at
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Status
                </StyledTableCell>
                <StyledTableCell
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {globalAdminData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>
                      <Checkbox />
                    </StyledTableCell>
                    <StyledTableCell>{item.name}</StyledTableCell>
                    <StyledTableCell>
                      {formatDate(item.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell>{item.status}</StyledTableCell>
                    <StyledTableCell>
                      <div className="flex gap-4 justify-center">
                        <Tooltip title="Reject this item" arrow>
                          <ActionButton
                            variant="contained"
                            color="error"
                            onClick={() => updateStatus(item._id, "Reject")}
                            disabled={isDeleting}
                          >
                            {isUpdating ? "reject..." : "Reject"}
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Approve this item" arrow>
                          <ActionButton
                            variant="contained"
                            color="success"
                            onClick={() => updateStatus(item._id, "Approved")}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "approved..." : "Approved"}
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="View details" arrow>
                          <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              const newPath = removeInitialPath(item.filePath);
                              handleDownload(`/temp/${newPath}`);
                              console.log(newPath);
                            }}
                          >
                            View
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Upload report" arrow>
                          <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Upload report
                          </ActionButton>
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={globalAdminData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
          <input
            type="file"
            ref={ref}
            onChange={handleFileInputChange}
            hidden
          />
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
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Selected file:
            {/* Show selected file name */}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Tooltip title="Cancel">
              <Button
                onClick={() => setIsModalOpen(false)}
                color="secondary"
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
            </Tooltip>
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
      </Modal>
    </>
  );
}

export default AdminTable;
