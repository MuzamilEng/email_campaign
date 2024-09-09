// GlobalStateContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../customHooks/useFetch";
import { useGetInvoicesDetailsQuery } from "../store/storeApi";

// Create context
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const { data: invoicesDetails, isLoading, isError } = useGetInvoicesDetailsQuery();
  console.log(invoicesDetails, "invoicesDetails");
  const [menuBar, setMenuBar] = useState(false);
  const [hamburger, setHamburger] = useState(true);
  const [userLoginInfo, setUserLoginInfoState] = useState(null);
  const [uploadFile, setUploadFile] = useState(false);
  const [csvViewData, setCsvViewData] = useState(null);
  const [forgetEmail, setForgetEmail] = useState({
    email: "",
    newPassword: "",
    otp: "",
  });
  const [userReport, setUserReport] = useState({});
  const [currentUserInvoiveData, setCurrentUserInvoiveData] = useState([]);
  const [monthlyInvoice, setMonthlyInvoice] = useState([]);
  const [globalAdminData, setGlobalAdminData] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("token"));
  const userPenCardNumber = currentUser?.user?.penCardNumber;
  const [open, setOpen] = React.useState(false);
  const [searchMonth, setSearchMonth] = React.useState("");
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const { fetchCsvData } = useFetch();
  const [viewCsvTable, setViewCsvTable] = useState(false);
const [adminEmail,setAdminEmail] = useState('')
  const handleDownload = (filePath) => {
    fetchCsvData(filePath, (csvData) => {
      if (csvData.length > 0) {
        setCsvViewData(csvData);
        setOpen(false);
      }
    });
  };

  const handleView = (fileName) => {
    const filePath = fileName;
    handleDownload(filePath);
  };
  function removeInitialPath(filePath) {
    // Extract the filename from the full file path
    // const parts = filePath.split(/[/\\]/); // Split by both forward slash and backslash
    // const filename = parts.pop(); // Get the last part, which should be the filename
    let filename = filePath;
    return filename;
  }
  console.log(csvViewData, "myData");
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filterByMonth = (invoice) => {
    if (!searchMonth) return true;
    return (
      invoice?.month?.substring(0, 3).toLowerCase() === searchMonth.substring(0, 3).toLowerCase()
    );
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSearchMonth(selectedMonth);
    const getInvoiceByMonth = monthlyInvoice?.filter(
      (invoice) =>
        invoice?.month?.substring(0, 3).toLowerCase() ===
        selectedMonth.substring(0, 3).toLowerCase()
    );
    // console.log(getInvoiceByMonth, "getInvoiceByMonth");
    setCurrentUserInvoiveData(getInvoiceByMonth);
  };

  useEffect(() => {
    if (invoicesDetails?.data) {
      const newPath = removeInitialPath(invoicesDetails?.data?.file);
      handleDownload(newPath);
    }
  }, [invoicesDetails?.data?.filePath]);

  useEffect(() => {
    if (csvViewData) {
      const filteredData = csvViewData?.filter((item) => item?.pan == userPenCardNumber);
      // console.log(filteredData, "filteredData");
      setCurrentUserInvoiveData(filteredData);
      setMonthlyInvoice(filteredData);
    }
  }, [csvViewData]);

  console.log(currentUserInvoiveData, "current data");

  return (
    <GlobalStateContext.Provider
      value={{
        menuBar,
        setMenuBar,
        hamburger,
        setHamburger,
        userLoginInfo,
        uploadFile,
        setUploadFile,
        csvViewData,
        setCsvViewData,
        forgetEmail,
        setForgetEmail,
        globalAdminData,
        setGlobalAdminData,
        userReport,
        setUserReport,
        monthlyInvoice,
        setMonthlyInvoice,
        currentUserInvoiveData,
        setCurrentUserInvoiveData,
        months,
        filterByMonth,
        handleMonthChange,
        adminEmail,setAdminEmail
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalStateContext);
