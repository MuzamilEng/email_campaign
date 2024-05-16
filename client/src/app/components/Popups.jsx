import React from "react";
import { useUpdateRecordMutation } from "../store/storeApi";
import { Toaster, toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
// import { dashboardForm } from "../data";

export const FormPopup = ({ setPopup, id }) => {
  const {  reset, control, handleSubmit, formState: { errors }, } = useForm();
  const [updateAdminData, { isLoading, isError, isSuccess }] = useUpdateRecordMutation();

  const onSubmit = async (data) => {
    try {
      const formData = {
        name: data.name,
        time: data.time,
        date: data.date,
      };
      await updateAdminData({ id, data: formData }).unwrap();
      console.log("Updated data:", formData);

      setPopup(false);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }
  };
  if (isSuccess) {
    toast.success("Data Updated");
  }
  return (
    <main className="w-full z-50 h-screen bg-gray-700 absolute top-0 left-0 opacity-95">
      <Toaster />
      <p
        className="text-white hover:bg-gray-400 rounded-md flex items-center justify-center w-[3vw] h-[3vw] absolute top-[2vw] right-[2vw] font-bold text-[2vw] hover:cursor-pointer"
        onClick={() => setPopup(false)}
      >
        X
      </p>
      <section className="flex z-50 justify-center h-full items-center">
        <form
          className="bg-[white]/40 p-[3vw] rounded-xl w-[30vw] "
          onSubmit={handleSubmit(onSubmit)}
        >
          <button className="w-full p-[0.5vw] text-white text-[1vw] hover:bg-blue-600 bg-blue-500 rounded-md mt-[2vw]">
            {isLoading ? <p>Loading....</p> : <p>update</p>}
          </button>
        </form>
      </section>
    </main>
  );
};
