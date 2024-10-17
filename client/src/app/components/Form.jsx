import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useGetAllRecordsQuery, useSubmitFormMutation } from "../store/storeApi";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalStateProvider";
import { FileUpload } from "./FileUpload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const Form = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { refetch } = useGetAllRecordsQuery();
  const { setUploadFile } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [recordFile, setRecordFile] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({
    noOfPoints: "",
    message: "",
    startDate: dayjs(null),
    endDate: dayjs(null),
    file: null,
    emailCount: "", // Email count field
  });
  const [submitData, { isLoading, isError, error, isSuccess }] = useSubmitFormMutation();
  const [userId, setUserId] = useState("");

  const handleFileChange = (file) => {
    setRecordFile(file);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in campaignDetails) {
        formData.append(key, campaignDetails[key]);
      }
      formData.append("id", userId);
      if (recordFile) {
        formData.append("dataFile", recordFile);
      }

      const response = await submitData(formData);

      setUploadFile(true);
      setOpen(false);
      setCampaignDetails({});
      refetch();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("token"));
    setUserId(id?.user?._id);
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong in file upload, please try again");
    }
    if (isSuccess) {
      toast.success("File uploaded successfully");
      setOpen(false);
    }
  }, [isError, isSuccess]);

  return (
    <main className="flex w-full justify-center p-[1vw] items-center">
      <Toaster position="top-center" />
      <section className="bg-white max-w-[55vw] w-full p-[1vw]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Button variant="contained" size="large" onClick={handleClickOpen}>
              Upload Email Data
            </Button>
          </Box>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title">Upload Email Data</DialogTitle>
            <DialogContent dividers>
              <form onSubmit={handleSubmit(onSubmit)} id="createBoardForm">
                <section className="w-full flex flex-col items-center border-dashed p-[4vw]">
                  <span className="text-[0.8vw] font-medium mt-[0.7vw] text-gray-600">
                    Upload up to 1 file at once. Upgrade for more
                  </span>
                  <figure className="cursor-pointer">
                    <FileUpload handleFile={handleFileChange} />
                  </figure>
                </section>

                {/* Email Count Field */}
                <Controller
                  name="emailCount"
                  control={control}
                  defaultValue={campaignDetails.emailCount}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Count"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={campaignDetails.emailCount} // Ensure value is bound to campaignDetails state
                      onChange={(e) =>
                        setCampaignDetails({
                          ...campaignDetails,
                          emailCount: e.target.value,
                        })
                      }
                    />
                  )}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                type="submit"
                form="createBoardForm"
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </section>
    </main>
  );
};

export default Form;
