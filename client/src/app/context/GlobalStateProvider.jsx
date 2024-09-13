// GlobalStateContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../customHooks/useFetch";
import { useGetInvoicesDetailsQuery } from "../store/storeApi";

// Create context
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const { data: invoicesDetails, isLoading, isError } = useGetInvoicesDetailsQuery();

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
  const [adminEmail, setAdminEmail] = useState("");
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
    let filename = filePath;
    return filename;
  }

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

    setCurrentUserInvoiveData(getInvoiceByMonth);
  };

  useEffect(() => {
    if (invoicesDetails?.data) {
      const newPath = removeInitialPath(invoicesDetails?.data?.file);
      handleDownload(newPath);
    }
  }, [invoicesDetails?.data?.file]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"));

    if (user?.user?.email === "admin@gmail.com") {
      // navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    if (csvViewData) {
      // Check if the logged-in user is an admin
      const user = JSON?.parse(localStorage.getItem("token"));
      const isAdmin = user?.user?.email === "admin@gmail.com";
  
      if (isAdmin) {
        // If the user is an admin, set all CSV data without filtering
        setCurrentUserInvoiveData(csvViewData);
        setMonthlyInvoice(csvViewData);
      } else {
        // If the user is not an admin, filter the data based on PAN card fields
        const filteredData = csvViewData?.filter((item) => {
          // Normalize the keys and values for comparison
          const panCardFields = ["pan", "pancard", "Pan", "PanCard", "Pancard", "Pan Card", "pan card"];
          
          return panCardFields?.some((field) => {
            const itemValue = item[field];
            return itemValue && itemValue?.toLowerCase() === userPenCardNumber?.toLowerCase();
          });
        });
    
        setCurrentUserInvoiveData(filteredData);
        setMonthlyInvoice(filteredData);
      }
    }
  }, [csvViewData, userPenCardNumber]);
  
  

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
        adminEmail,
        setAdminEmail,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalStateContext);
