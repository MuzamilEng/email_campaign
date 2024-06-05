import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full p-[0.4vw] bg-[#525A6F] text-white flex justify-between items-center">
      <nav className="flex items-center flex-col">
      <figure className="w-full max-w-[3vw]">
        <img src="/img/logo3.png" alt="wahix india" className="w-full" />
      </figure>
      <h2 className="text-[0.7vw] font-bold text-white">WAHIX DEVELOPEMENT</h2>
        <h4 className="text-[0.4vw] font-bold text-white">DIGITAL MARKETING PIONEERS</h4>
      </nav>
    </header>
  );
};

export default Header;