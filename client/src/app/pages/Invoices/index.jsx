import React, { useState } from "react";
import { InvoiceDetail } from "../../components/InvoiceDetail";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalStateProvider";
import useFetch from "../../../customHooks/useFetch";
import ViewCsv from "../ViewCsv";

const Invoices = () => {
  return (
    <Layout>
      {/* <InvoiceDetail /> */}
      <ViewCsv />
    </Layout>
  );
};

export default Invoices;
