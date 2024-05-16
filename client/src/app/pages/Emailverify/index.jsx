import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { set } from "react-hook-form";
import Layout from "../../Layout/Layout";
import {Icon} from "@iconify/react";
import Loading from "../../components/Loading";

const index = () => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const [validUrl, setValidUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const verifiedEmailUser = async () => {
      setLoading(true)
      try {
        const url = `${apiUrl}/auth/${params.id}/verify/${params.token}`;
        const data = await axios.get(url);
        setValidUrl(true);
        setLoading(false)
      } catch (err) {
        console.log(err.message);
        setValidUrl(false);
        setLoading(false)
      }
    };
    verifiedEmailUser();
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, [params]);
  return (
    <Layout>
      {validUrl ? (
        <div className="w-full flex flex-col items-center justify-center h-screen"> 
        <section className="flex flex-col items-center border-gray-700 border-[1px] rounded-md p-[3vw] -mt-[5vw] shadow-lg">
        <Icon icon="mingcute:mail-send-line" className="text-[5vw]" />
          <div className="" style={{ width: "5vw" }}>
            <img
              src="/img/verify.png"
              alt=""
              className={styles.img_success}
              style={{ width: "100%" }}
            />
          </div>
          <h1 className="text-[1vw] text-gray-600">Email verified successfuly!</h1>
        </section>
        </div>
      ) : (
        <>
        {loading ? <Loading /> :  <p className="text-[2vw] mt-[3vw] text-center text-gray-600">Invalid Link!</p> }
        </>
      )}
    </Layout>
  );
};

export default index;