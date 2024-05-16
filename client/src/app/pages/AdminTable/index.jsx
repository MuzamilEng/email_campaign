import React, { useEffect, useState } from "react";
import {
  useDeleteAdminDataMutation,
  useGetAllRecordsQuery,
  useUpdateAdminStatusMutation,
} from "../../store/storeApi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FormPopup } from "../../components/Popups";
import { useGlobalContext } from "../../context/GlobalStateProvider";
import { Toaster, toast } from "sonner";
import AdminLayout from "../../Layout/AdminLayout";
import useFetch from "../../../customHooks/useFetch";
// import { parse } from "papaparse";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import AdminTable from "../../components/AdminTable";
const Index = () => {
  const [idToDelete, setIdToDelete] = useState(null);
  const apiUrl = "http://localhost:5173" || import.meta.env.VITE_REACT_API_URL;
  const {
    isError,
    isLoading,
    data,
    refetch: refetchStatus,
  } = useGetAllRecordsQuery();
  const [deleteAdminData, { isLoading: isDeleting, isError: deleteError }] =
    useDeleteAdminDataMutation();
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
  const handleDelete = async (id) => {
    try {
      await deleteAdminData(id);
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const [
    updateAdmin,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useUpdateAdminStatusMutation();
  const updateStatus = async (id, status) => {
    try {
      updateAdmin({ id, data: { status } }).unwrap();
      console.log(status);
      refetchStatus();
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleView = (fileName) => {
    window.open(`/temp/${fileName}`, "_blank");
  };
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const { fetchCsvData } = useFetch();
  let { csvViewData, setCsvViewData, globalAdminData, setGlobalAdminData } =
    useGlobalContext();
  const [viewCsvTable, setViewCsvTable] = useState(false);

  if (isUpdateError) {
    toast.error("Something wrong");
  }
  const handleDownload = (filePath) => {
    fetchCsvData(filePath, (csvData) => {
      if (csvData.length > 0) {
        setCsvViewData(csvData);
        navigate("/csv"); // Assuming navigate is obtained from useNavigate hook
      }
    });
  };
  function removeInitialPath(filePath) {
    // Split the file path by the directory separator
    let parts = filePath.split("\\"); // For Windows paths

    // Find the index of the filename in the parts array
    let filenameIndex = parts.indexOf("Sample-Spreadsheet-10-rows.csv");

    // Get the filename and the remaining parts after the filename
    let filename = parts[filenameIndex];
    let remainingParts = parts.slice(filenameIndex);

    // Join the remaining parts to form the new file path
    let newPath = remainingParts.join("\\"); // For Windows paths

    return newPath;
  }
  useEffect(() => {
    setGlobalAdminData(data?.data);
  }, [data]);
  return (
    <>
      <AdminLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-[2vw] w-full mt-[3vw] text-center font-bold mb-4">
            Admin Dashboard
          </h1>
          <Toaster />
          {isError && <div>Error loading data</div>}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <AdminTable
              globalAdminData={globalAdminData}
              updateStatus={updateStatus}
              handleDownload={handleDownload}
              formatDate={formatDate}
              removeInitialPath={removeInitialPath}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Index;
