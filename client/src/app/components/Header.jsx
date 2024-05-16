import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full p-[0.4vw] bg-[#525A6F] text-white flex justify-between items-center">
      <figure className="w-full max-w-[7vw]">
        <img src="/img/logo1.png" alt="wahix india" className="w-full" />
      </figure>
    </header>
  );
};

export default Header;
