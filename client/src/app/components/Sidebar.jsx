import React from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebar } from "../data";
import { Icon } from "@iconify/react";

const Sidebar = () => {
  return (
    <aside className=" w-full max-w-[17vw] p-[1vw] h-screen bg-gray-800 fixed">
      <main className="mx-[1vw] col-center">
        <figure className="w-full max-w-[4vw] ml-[2vw]">
          <Icon
            icon="mingcute:mail-send-line"
            className="text-[4vw] text-white"
          />
        </figure>
      </main>
    </aside>
  );
};

export default Sidebar;
