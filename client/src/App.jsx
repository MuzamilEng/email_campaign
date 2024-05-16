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
function App() {
  const [admin, setAdmin] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem("token");

  if (admin) {
    navigate("/adminTable");
  }

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/users/:id/verify/:token" element={<Emailverify />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/adminTable" element={<AdminTable />} />
      <Route path="/csv" element={<ViewCsv />} />
    </Routes>
  );
}

export default App;
