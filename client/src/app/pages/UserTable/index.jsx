import React, { useEffect, useState, useCallback } from "react";
import { useGetAllRecordsQuery } from "../../store/storeApi";
import { useGlobalContext } from "../../context/GlobalStateProvider";
import Loading from "../../components/Loading";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteModal from "../../components/DeleteModal";
import UpdateModal from "../../components/UpdateModal";
import { FaCalendarAlt, FaFileDownload, FaEdit, FaTrashAlt } from "react-icons/fa";

const Index = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { uploadFile } = useGlobalContext();
  const [id, setId] = useState("");

  const { isLoading, data, refetch: refetchUserData } = useGetAllRecordsQuery(id);

  const tableHeads = ["Created at", "Report Name", "Action"];

  const formatDate = useCallback((dateString) => {
    const options = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }, []);

  useEffect(() => {
    refetchUserData();
    const storedData = JSON.parse(localStorage.getItem("token"));
    setId(storedData?.user?._id);
  }, [uploadFile, refetchUserData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = useCallback((fileName) => {
    fetch(`http://localhost:5000/temp/${fileName}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center w-full py-8">
      <TableContainer
        component={Paper}
        className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden"
      >
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              {tableHeads.map((item, index) => (
                <TableCell key={index} className="font-bold text-gray-700 px-6 py-4 text-left">
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                <TableCell className="px-6 py-4 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {item?.reportFile ? (
                    <Tooltip title="Download Report">
                      <Box
                        onClick={() => handleDownload(item.reportFile)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          color: "primary.main",
                        }}
                        className="hover:underline"
                      >
                        <FaFileDownload />
                        <Typography variant="body2" component="span">
                          Download
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <span className="text-gray-500">No Report</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex gap-4">
                    <Tooltip title="Update">
                      <Box className="cursor-pointer text-blue-600 hover:text-blue-800">
                        <UpdateModal id={item._id}>
                          <FaEdit size={18} />
                        </UpdateModal>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Box className="cursor-pointer text-red-600 hover:text-red-800">
                        <DeleteModal id={item._id}>
                          <FaTrashAlt size={18} />
                        </DeleteModal>
                      </Box>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.data.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="bg-gray-50"
        />
      </TableContainer>
    </div>
  );
};

export default Index;
