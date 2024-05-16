import React from "react";
import Form from "../../components/Form";
import Index from "../UserTable";
import Layout from "../../Layout/Layout";

const index = () => {
  return (
    <>
      <Layout>
      <main className="">
      <Form />
      </main>
      <Index  />
      </Layout>
    </>
  );
};

export default index;
