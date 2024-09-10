import React, { useEffect, useState } from "react";
import { useDeleteAdminDataMutation, useGetAllRecordsQuery } from "../../store/storeApi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FormPopup } from "../../components/Popups";
import { useGlobalContext } from "../../context/GlobalStateProvider";
import DownloadIcon from "@mui/icons-material/Download";
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

const Index = () => {
  const [popup, setPopup] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const { uploadFile, userReport, setUserReport } = useGlobalContext();
  const [id, setId] = useState("");
  const { isError, isLoading, data, refetch: refetchUserData } = useGetAllRecordsQuery(id);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const tableHeads = ["Check", "Created at", "Report Name", "Action"];

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const [deleteAdminData, { isLoading: isDeleting, isError: deleteError }] =
    useDeleteAdminDataMutation();

  const showPopup = (id) => {
    setPopup(true);
    setIdToDelete(id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminData(id);
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    refetchUserData();
  };

  useEffect(() => {
    refetchUserData();
    const id = JSON.parse(localStorage.getItem("token"));
    setId(id?.user?._id);
  }, [uploadFile]);
  console.log(id, "iddddd");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = (fileName) => {
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
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-center items-center -mt-[1vw] w-full">
        <TableContainer component={Paper} className="w-full max-w-[70vw] shadow rounded mt-[2vw]">
          <Table>
            <TableHead className="">
              <TableRow>
                {tableHeads?.map((item, index) => (
                  <TableCell
                    key={index}
                    style={{ fontWeight: "bold" }}
                    className="text-md px-6 py-2 border-r border-solid w-1/6 text-start whitespace-nowrap hover:bg-[#d4f1ff]"
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index} className={"hover:bg-[#f0faff]"}>
                    <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      <input type="checkbox" />
                    </TableCell>
                    {/* <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      {item?.file
                        ? "Custom Data"
                        : item?.noOfPoints + " points"}
                    </TableCell> */}
                    {/* <TableCell
                      className={`items-center text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer text-center`}
                    >
                      <p
                        className={`${
                          item?.status == "Waiting"
                            ? "text-yellow-600"
                            : item?.status == "Approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status}
                      </p>
                    </TableCell> */}
                    {/* <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      {item?.startDate && item?.endDate
                        ? `${formatDate(item.startDate)} - ${formatDate(
                            item.endDate
                          )}`
                        : item?.startDate
                        ? `${formatDate(item.startDate)}`
                        : item?.endDate
                        ? `${formatDate(item.endDate)}`
                        : ""}
                    </TableCell> */}
                    <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      {item?.reportFile ? (
                        <Tooltip title="Download Report">
                          <Box
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleDownload(item.reportFile)}
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
                      ) : (
                        "No Report"
                      )}
                    </TableCell>
                    <TableCell className="text-md p-[0.5vw] hover:underline hover:font-medium border-r border-solid hover:cursor-pointer">
                      <div className="flex gap-2 justify-center">
                        <UpdateModal id={item?._id} />
                        <DeleteModal id={item?._id} />
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
          />
        </TableContainer>
      </div>
    </>
  );
};

export default Index;
