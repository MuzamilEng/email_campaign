import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import axios from "axios";
import {
  useGetAllRecordsQuery,
  useSubmitFormMutation,
} from "../store/storeApi";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalStateProvider";
import { Icon } from "@iconify/react";
import { FileUpload } from "./FileUpload";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import DateRangePicker from "./DatePicker";

const Form = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data, refetch } = useGetAllRecordsQuery();
  const navigate = useNavigate();
  const { setUploadFile } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [showPointFields, setShowPointFields] = useState(false);
  const [recordFile, setRecordFile] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({
    noOfPoints: "",
    message: "",
    startDate: dayjs(null),
    endDate: dayjs(null),
    file: null,
  });
  const [submitData, { isLoading, isError, error, isSuccess, success }] =
    useSubmitFormMutation();
  const [userId, setUserId] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);

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
    if (
      !dayjs(campaignDetails.startDate).isValid() ||
      !dayjs(campaignDetails.endDate).isValid()
    ) {
      toast.error("Please select valid start and end dates");
      return;
    }
    console.log(campaignDetails.startDate.$d, "dddateStart");
    try {
      const formData = new FormData();
      for (const key in campaignDetails) {
        formData.append(key, campaignDetails[key]);
        console.log(key, campaignDetails[key]);
      }
      if (recordFile) {
        formData.append("dataFile", recordFile);
      }

      const response = await submitData(formData);

      setUploadFile(true);
      localStorage.setItem("csvData", JSON.stringify(response?.data));
      toast.success("File uploaded successfully");
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.data.message);
      // Handle error
    }
  };
  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("token"));
    campaignDetails.id = id?.user?._id;
    setUserId(id?.user?._id);
  }, []);

  useEffect(() => {
    if (showPointFields && campaignDetails.noOfPoints) {
      const points = parseInt(campaignDetails.noOfPoints, 10);
      if (!isNaN(points)) {
        setCalculatedPoints(points * 50);
      } else {
        setCalculatedPoints(0);
      }
    }
  }, [showPointFields, campaignDetails.noOfPoints]);

  return (
    <main className="flex w-full justify-center p-[1vw] items-center">
      <Toaster position="top-center" />
      <section className="bg-white max-w-[55vw] w-full p-[1vw]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="">
            <Button variant="contained" size="large" onClick={handleClickOpen}>
              Start Campaign
            </Button>
          </Box>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title">
              Initialize Campaign
            </DialogTitle>
            <DialogContent dividers>
              <form onSubmit={handleSubmit(onSubmit)} id="createBoardForm">
                <section className=" w-full flex flex-col items-center border-dashed p-[1vw]">
                  <span className="text-[0.8vw] font-medium mt-[0.7vw] text-gray-600">
                    Upload up to 1 file at once. Upgrade for more
                  </span>
                  <figure className=" cursor-pointer">
                    <FileUpload handleFile={handleFileChange} />
                  </figure>
                  <span
                    onClick={() => setShowPointFields(!showPointFields)}
                    className="text-[0.8vw] cursor-pointer hover:underline font-medium mt-[0.7vw] text-gray-600"
                  >
                    {!showPointFields
                      ? "or use no of points."
                      : "upload your file"}
                  </span>
                </section>
                {showPointFields && (
                  <>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="noOfPoints"
                      label="No of points"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={campaignDetails?.noOfPoints}
                      onChange={(event) =>
                        setCampaignDetails({
                          ...campaignDetails,
                          noOfPoints: event.target.value,
                        })
                      }
                      required // Mark the field as required
                    />
                    <TextField
                      margin="dense"
                      id="calculatedPoints"
                      label="Calculated Points"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={calculatedPoints}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </>
                )}
                <div className="mt-[1vw]">
                  <DateRangePicker
                    startDate={campaignDetails.startDate}
                    endDate={campaignDetails.endDate}
                    setStartDate={(date) =>
                      setCampaignDetails({
                        ...campaignDetails,
                        startDate: date,
                      })
                    }
                    setEndDate={(date) =>
                      setCampaignDetails({ ...campaignDetails, endDate: date })
                    }
                  />
                </div>
                <TextField
                  margin="dense"
                  id="message"
                  label="Message"
                  type="text"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={campaignDetails?.message}
                  required
                  onChange={(event) =>
                    setCampaignDetails({
                      ...campaignDetails,
                      message: event.target.value,
                    })
                  }
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
                submit
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </section>
    </main>
  );
};

export default Form;
