import React, { useEffect, useState } from "react";
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
import styled from "@mui/material/styles/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useUploadReportMutation } from "../store/storeApi";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "../context/GlobalStateProvider";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";

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
  formatDate,
  removeInitialPath,
  isUpdating,
  handleDownload,
  isDeleting,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [csvId, setCsvId] = useState(null);
  const [csvFilename, setFilename] = useState(null);
  // const ref = useRef();
  const navi = useNavigate();
  const [uploadReport, { isLoading, isError, data, isSuccess }] = useUploadReportMutation();
  const [mainId, setId] = useState(null);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const { userReport, setUserReport } = useGlobalContext();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    let id = JSON.parse(localStorage.getItem("csvData"));
    setCsvId(id?.campaignRecord?._id);

    setFilename(id?.campaignRecord?.file);
  }, [csvId]);
  // console.log(csvFilename, "file name");
  return (
    <>
      <Toaster />
      <Paper className="mt-[2vw] shadow rounded">
        <TableContainer>
          <Table className="w-full">
            <TableHead className="bg-gray-200">
              <TableRow>
                <StyledTableCell style={{ fontWeight: "bold" }}>Check</StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>Name</StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>Created at</StyledTableCell>
                {/* <StyledTableCell style={{ fontWeight: "bold" }}>
                  Status
                </StyledTableCell> */}
                <StyledTableCell style={{ fontWeight: "bold" }}>Files</StyledTableCell>
                {/* <StyledTableCell
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Action
                </StyledTableCell> */}
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
                    <StyledTableCell>{item.firstName ? item.firstName : "User"}</StyledTableCell>
                    <StyledTableCell>{formatDate(item.createdAt)}</StyledTableCell>
                    {/* <StyledTableCell>{item.status}</StyledTableCell> */}
                    <StyledTableCell>
                      <Tooltip title="download" arrow>
                        <Box
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleDownload(csvFilename)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            color: "primary.main",
                            textDecoration: "underline",
                          }}
                        >
                          <DownloadIcon />
                          <Typography variant="body2" component="span">
                            Download
                          </Typography>
                        </Box>
                      </Tooltip>
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
    </>
  );
}

export default AdminTable;
