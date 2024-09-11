import React, { useEffect, useState } from "react";
import {
  useAdminRecordsQuery,
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
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import AdminTable from "../../components/AdminTable";

const Index = () => {
  const [idToDelete, setIdToDelete] = useState(null);
  const apiUrl = "http://api.apps.wahix.com/api/v1" || import.meta.env.VITE_REACT_API_URL;
  const { isError, isLoading, data, refetch: refetchStatus } = useAdminRecordsQuery();
  const [deleteAdminData, { isLoading: isDeleting, isError: deleteError }] =
    useDeleteAdminDataMutation();
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const { fetchCsvData } = useFetch();
  let { csvViewData, setCsvViewData, globalAdminData, setGlobalAdminData } = useGlobalContext();
  const [viewCsvTable, setViewCsvTable] = useState(false);

  const [
    updateAdmin,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError },
  ] = useUpdateAdminStatusMutation();

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
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      updateAdmin({ id, data: { status } }).unwrap();

      refetchStatus();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDownload = (filePath) => {
    fetchCsvData(filePath, (sanitizedData) => {
      if (sanitizedData.length > 0) {
        const csv = Papa.unparse(sanitizedData); // Convert sanitized data to CSV string

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Correct MIME type

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "downloaded_file.csv"); // Proper file extension
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
      }
    });
  };

  function removeInitialPath(filePath) {
    let parts = filePath.split("\\");
    let filenameIndex = parts.indexOf("Sample-Spreadsheet-10-rows.csv");
    let remainingParts = parts.slice(filenameIndex);
    let newPath = remainingParts.join("\\");
    return newPath;
  }

  useEffect(() => {
    setGlobalAdminData(data?.data);
  }, [data]);

  if (isUpdateError) {
    toast.error("Something wrong");
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"));

    if (user?.user?.email !== "admin@gmail.com") {
      navigate("/");
      return;
    }
  }, []);
  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-[2vw] w-full mt-[3vw] text-center font-bold mb-4">Admin Dashboard</h1>
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
  );
};

export default Index;
