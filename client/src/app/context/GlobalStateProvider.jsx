// GlobalStateContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Create context
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
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
  const [globalAdminData, setGlobalAdminData] = useState([]);
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
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalStateContext);
