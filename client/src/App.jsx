import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import Main from "./app/pages/Main";
import Signup from "./app/pages/Singup";
import Login from "./app/pages/Login";
import Emailverify from "./app/pages/Emailverify";
import ForgetPassword from "./app/pages/ForgetPassword";
import ResetPassword from "./app/pages/ResetPassword";
import Dashboard from "./app/pages/Dashboard";
import UserTable from "./app/pages/UserTable";
import AdminTable from "./app/pages/AdminTable";
import ViewCsv from "./app/pages/ViewCsv";
import { useEffect, useState } from "react";
import Invoices from "./app/pages/Invoices";

import FileUploadByAdmin from "./app/pages/FileUploadByAdmin";
import Wellcome from "./app/pages/Wellcome";
import UpdateProfile from "./app/pages/UpdateProfile";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<Main />} />
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/users/:id/verify/:token" element={<Emailverify />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/adminTable" element={<AdminTable />} />
      <Route path="/csv" element={<ViewCsv />} />
      <Route path="/fileuploadbyadmin" element={<FileUploadByAdmin />} />
      <Route path="/wellcome" element={<Wellcome />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
    </Routes>
  );
}

export default App;
