import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useGetAllRecordsQuery, useGetInvoicesDetailsQuery, useGetLogedinUserQuery } from "../store/storeApi";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGlobalContext } from "../context/GlobalStateProvider";

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
  const {data: invoicesDetails, isLoading, isError} = useGetInvoicesDetailsQuery();
  const { currentUserInvoiveData, setCurrentUserInvoiveData, months, filterByMonth, handleMonthChange } = useGlobalContext();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const uniqueMonths = new Set();



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
          {currentUserInvoiveData?.filter(filterByMonth)?.map((invoice, index) => {
           const monthKey = invoice?.month?.substring(0, 3).toLowerCase();
            if (uniqueMonths.has(monthKey)) {
              return null;
            }
            uniqueMonths.add(monthKey);
            return (
              <ListItemStyled key={index}>
                <ListItemText onClick={() => {
                  setOpen(false);
                }}
                  primary={`Invoice Month: ${invoice?.month} `}
                />
              </ListItemStyled>
            );
          })}
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
