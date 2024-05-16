import React from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebar } from "../data";
import { Icon } from "@iconify/react";
import { useGlobalContext } from "../context/GlobalStateProvider";
import {
  useGetAllRecordsQuery,
  useGetOnlyApprovedDataQuery,
  useGetOnlyRejectDataQuery,
  useGetOnlyWaitingDataQuery,
} from "../store/storeApi";

const Sidebar = () => {
  const { globalAdminData, setGlobalAdminData } = useGlobalContext();
  const {
    isError,
    isLoading,
    data,
    // refetch: refetchStatus,
  } = useGetOnlyApprovedDataQuery();
  const {
    isError: isError2,
    isLoading: isLoading2,
    data: data2,
    // refetch: refetchStatus,
  } = useGetOnlyRejectDataQuery();
  const {
    isError: isError3,
    isLoading: isLoading3,
    data: data3,
    // refetch: refetchStatus,
  } = useGetOnlyWaitingDataQuery();
  const {
    isError: isError4,
    isLoading: isLoading4,
    data: data4,
    // refetch: refetchStatus,
  } = useGetAllRecordsQuery();

  const location = useLocation();
  const handleAdminData = (title) => {
    if (title === "Pending Requests") {
      setGlobalAdminData(data3?.data);
      console.log("Pending Requests");
    }
    if (title === "Approved Requests") {
      console.log(data.data);
      setGlobalAdminData(data?.data);
    }
    if (title === "Reject Requests") {
      setGlobalAdminData(data2?.data);
      console.log("Rejected Requests");
    }
    if (title === "All") {
      setGlobalAdminData(data4?.data);
      console.log("Rejected Requests");
    }
  };
  // console.log(data, "sidebarrrr");
  return (
    <aside className=" w-full max-w-[17vw] p-[1vw] h-screen bg-gray-800 fixed">
      <main className="mx-[1vw] col-center">
        <figure className="w-full max-w-[4vw] ml-[2vw]">
          <Icon
            icon="mingcute:mail-send-line"
            className="text-[4vw] text-white"
          />
        </figure>
        <section className="mt-[2vw]">
          {sidebar?.map((item, index) => (
            <div
              key={index}
              className={`flex transition-all duration-300 m-[0.5vw] p-[0.7vw]
              cursor-pointer  
           ${
             location.pathname === item?.path
               ? "border-r-[0.4vw] text-white text-medium border-[#ffff]"
               : "hover:border-r-[0.4vw] text-[#A5A4A4]"
           }`}
            >
              <span className="text-[0.9vw]">
                <Icon icon="ic:outline-dashboard" />
              </span>
              <span
                className="ml-[1vw] text-[1vw] font-medium"
                onClick={() => handleAdminData(item.title)}
              >
                {item?.title}
              </span>
            </div>
          ))}
        </section>
      </main>
    </aside>
  );
};

export default Sidebar;
