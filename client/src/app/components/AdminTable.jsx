import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
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
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={globalAdminData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default AdminTable;
