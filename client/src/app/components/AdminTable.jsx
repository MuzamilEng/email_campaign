import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useGlobalContext } from "../context/GlobalStateProvider";
import { FaDownload, FaUser, FaCalendarAlt, FaFileAlt } from "react-icons/fa";

const ActionButton = styled(Button)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "16px",
  borderBottom: "1px solid #e0e0e0",
  fontSize: "0.875rem",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  transition: "background-color 0.3s",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

function AdminTable({ globalAdminData, formatDate, handleDownload }) {
  const [page, setPage] = useState(0);
  console.log(globalAdminData, "globalAdminData");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [csvFilename, setFilename] = useState(null);
  const navigate = useNavigate();
  const { userReport, setUserReport } = useGlobalContext();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("csvData"));
    setFilename(id?.campaignRecord?.file);
  }, []);

  return (
    <>
      <Toaster />
      <Paper elevation={3} className="mt-8 rounded-lg overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontWeight: "bold", backgroundColor: "#f3f4f6" }}>
                  <IconWrapper>
                    <FaUser />
                    <span>Name</span>
                  </IconWrapper>
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold", backgroundColor: "#f3f4f6" }}>
                  <IconWrapper>
                    <FaCalendarAlt />
                    <span>Created at</span>
                  </IconWrapper>
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold", backgroundColor: "#f3f4f6" }}>
                  <IconWrapper>
                    <FaFileAlt />
                    <span>Files</span>
                  </IconWrapper>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {globalAdminData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{item?.firstName || "User"}</StyledTableCell>
                    <StyledTableCell>{formatDate(item.createdAt)}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="Download" arrow>
                        <ActionButton
                          variant="outlined"
                          color="primary"
                          startIcon={<FaDownload />}
                          onClick={() => handleDownload(csvFilename)}
                        >
                          Download
                        </ActionButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={globalAdminData?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default AdminTable;
