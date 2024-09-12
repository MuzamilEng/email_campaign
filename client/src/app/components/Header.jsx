import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalStateProvider";

const Header = () => {
  const { adminEmail, setAdminEmail } = useGlobalContext();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    setUser(token.user.email);
  }, []);

  return (
    <header className="w-full p-[0.4vw] bg-[#525A6F] text-white flex justify-between items-center">
      <nav className="flex items-center flex-col">
        <figure className="w-full max-w-[3vw]">
          <img src="/img/logo3.png" alt="wahix india" className="w-full" />
        </figure>
        <h2 className="text-[0.7vw] font-bold text-white">WAHIX DEVELOPEMENT</h2>
        <h4 className="text-[0.4vw] font-bold text-white">DIGITAL MARKETING PIONEERS</h4>
      </nav>
      <div className="flex w-full max-w-[30vw] justify-around items-center">
        {adminEmail === "admin@gmail.com" || user === "admin@gmail.com" ? (
          <>
          <Link
            className="text-[1vw] hover:bg-slate-500 hover:rounded-md p-[0.5vw] text-white"
            to="/adminTable"
          >
            Admin Dashboard
          </Link>
          
          <Link
              className="text-[1vw] hover:bg-slate-500 hover:rounded-md p-[0.5vw] text-white"
              to="/invoices"
            >
              Invoices
            </Link>
          </>
        ) : (
          <>
            <Link
              className="text-[1vw] hover:bg-slate-500 hover:rounded-md p-[0.5vw] text-white"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-[1vw] hover:bg-slate-500 hover:rounded-md p-[0.5vw] text-white"
              to="/invoices"
            >
              Invoices
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <span className="relative z-10">Logout</span>
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
