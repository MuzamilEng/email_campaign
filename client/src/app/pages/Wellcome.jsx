import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";

const Wellcome = () => {
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("token"));
    setFirstName(data?.user?.firstName || "");
  }, []);
  return (
    <Layout>
      <div className="flex items-center justify-center h-screen">
        {firstName && (
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {firstName}!
          </h1>
        )}
      </div>
    </Layout>
  );
};

export default Wellcome;
