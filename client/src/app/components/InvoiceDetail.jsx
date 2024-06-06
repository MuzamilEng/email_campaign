import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useGetAllRecordsQuery, useGetLogedinUserQuery } from "../store/storeApi";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGlobalContext } from "../context/GlobalStateProvider";
import useFetch from "../../customHooks/useFetch";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "1rem",
});

const DrawerContent = styled(Box)({
  width: 320,
  padding: "1rem",
  backgroundColor: "#f9f9f9",
});

const ListItemStyled = styled(ListItem)({
  marginBottom: "8px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

const StyledListItemText = styled(ListItemText)({
  ".MuiListItemText-primary": {
    fontWeight: "bold",
  },
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
});

export function InvoiceDetail() {
  const [open, setOpen] = React.useState(false);
  const [searchMonth, setSearchMonth] = React.useState("");
  const { isLoading, isError, data } = useGetAllRecordsQuery();
  const handleView = (fileName) => {
    window.open(`/csv/${fileName}`, "_blank");
  };
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const { fetchCsvData } = useFetch();
  const { csvViewData, setCsvViewData, globalAdminData, setGlobalAdminData } = useGlobalContext();
  const [viewCsvTable, setViewCsvTable] = useState(false);

  const handleDownload = (filePath) => {
    fetchCsvData(filePath, (csvData) => {
      if (csvData.length > 0) {
        setCsvViewData(csvData);
        // navigate("/csv"); // Assuming navigate is obtained from useNavigate hook
      }
    });
  };
  function removeInitialPath(filePath) {
    // Split the file path by the directory separator
    let parts = filePath.split("\\"); // For Windows paths

    // Find the index of the filename in the parts array
    let filenameIndex = parts.indexOf("Sample-Spreadsheet-10-rows.csv");

    // Get the filename and the remaining parts after the filename
    let filename = parts[filenameIndex];
    let remainingParts = parts.slice(filenameIndex);

    // Join the remaining parts to form the new file path
    let newPath = remainingParts.join("\\"); // For Windows paths

    return newPath;
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September","October","November","December",
  ];

  const filterByMonth = (invoice) => {
    if (!searchMonth) return true;
    const invoiceMonth = new Date(invoice.createdAt).toLocaleString("en-us", {
      month: "long",
    });
    return invoiceMonth.toLowerCase() === searchMonth.toLowerCase();
  };

  const handleMonthChange = (event) => {
    setSearchMonth(event.target.value);
  };

  const DrawerList = (
    <DrawerContent role="presentation">
      <Header>
        <Typography variant="h6">Invoice Details</Typography>
        <Button onClick={toggleDrawer(false)}>
          <ChevronRightIcon />
        </Button>
      </Header>
      <Divider />
      <FormControl fullWidth style={{ marginBottom: "16px" }}>
        <InputLabel id="month-select-label">Select Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={searchMonth}
          label="Select Month"
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : isError ? (
        <Typography variant="body1" color="error">
         No record Found
        </Typography>
      ) : (
        <List>
          {data?.data?.filter(filterByMonth)?.map((invoice, index) => (
            <ListItemStyled key={index}>
              <ListItemText onClick={() => {
                const newPath = removeInitialPath(invoice?.filePath);
                handleDownload(`/csv/${newPath}`);
                setOpen(false);
              }}
                primary={`File Name: ${invoice.fileName ? invoice.fileName : "Custom points"}`}
                secondary={`Time Stamps: ${invoice.createdAt}`}
              />
            </ListItemStyled>
          ))}
        </List>
      )}
    </DrawerContent>
  );

  return (
    <div>
      <Container>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(true)}
        >
          Invoice Detail
        </Button>
      </Container>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
