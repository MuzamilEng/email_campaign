import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button, Tooltip, styled } from "@mui/material";

const Sidebar = () => {
  const navi = useNavigate();

  const ActionButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "1rem",
    padding: "10px 20px",
    marginTop: "20px",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  return (
    <aside className="w-full max-w-[17vw] p-[1vw] h-screen bg-gray-800 fixed">
      <main className="mx-[1vw] col-center">
        <figure className="w-full max-w-[4vw] ml-[2vw]">
          <Icon
            icon="mingcute:mail-send-line"
            className="text-[4vw] text-white"
          />
        </figure>
        <Tooltip title="Upload report" arrow>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => navi("/fileuploadbyadmin")}
          >
            Upload Invoice
          </ActionButton>
        </Tooltip>
      </main>
    </aside>
  );
};

export default Sidebar;
