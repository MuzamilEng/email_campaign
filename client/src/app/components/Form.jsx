import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useGetAllRecordsQuery, useSubmitFormMutation } from "../store/storeApi";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalStateProvider";
import { Icon } from "@iconify/react";
import { FileUpload } from "./FileUpload";


const Form = () => {
  const { reset, control, handleSubmit, formState: { errors } } = useForm();
  const { data, refetch } = useGetAllRecordsQuery();
  const navigate = useNavigate();
  const {setUploadFile} = useGlobalContext();
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitData, { isLoading, isError, error, isSuccess, success }] = useSubmitFormMutation();
  const handleFileChange = (file) => {
      setSelectedFile(file);
  };
  console.log(selectedFile, "file");

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append('name', userInfo?.user?.firstName)
      await submitData(formData);
      setUploadFile(true)
      toast.success("File uploaded successfully");
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.data.message);
      // Handle error
    }
  };
  return (
    <main className="flex w-full justify-center p-[1vw] items-center">
      <Toaster position="top-center" />
      <section className="bg-white max-w-[55vw] w-full p-[1vw]">
      <form onSubmit={handleSubmit(onSubmit)}
        className="shadow-md w-full flex flex-col form_bg items-center  max-w-[50vw] border-dashed p-[1vw] rounded-md bg- bg-opacity-90"
      >
        <Icon className="text-[3vw] text-blue-700" icon="fluent:folder-add-20-regular" />
        <p className="text-[1vw] font-medium mt-[0.7vw] text-black">Click to Upload or Drop CSV here</p>
        <span className="text-[0.8vw] font-medium mt-[0.7vw] text-gray-600">Upload up to 1 file at once. Upgrade for more</span>
        <figure className=" cursor-pointer" ><FileUpload handleFile={handleFileChange} /></figure>
        <button disabled={!selectedFile} className="mt-[1vw] bg-blue-700 w-full max-w-[6vw] hover:bg-blue-800  text-center items-center flex justify-center text-white p-[0.7vw] rounded-md" type="submit"><Icon icon="formkit:submit" className="text-[1vw]" />Submit</button>
      </form> 

      </section>
    </main>
  );
};

export default Form;