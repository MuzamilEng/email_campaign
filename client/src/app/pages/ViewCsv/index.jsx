import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalStateProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
} from "@mui/material";

const ViewCsv = () => {
  const { csvViewData, currentUserInvoiveData } = useGlobalContext();
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (csvViewData?.length > 0) {
      setColumns(Object.keys(csvViewData[0]));
      setRecords(currentUserInvoiveData);
    }
  }, [csvViewData, currentUserInvoiveData]);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRecords = React.useMemo(() => {
    if (!orderBy) return records;

    return [...records].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [records, order, orderBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {csvViewData?.length > 0 && (
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Invoice Details</h1>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="csv table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sortDirection={orderBy === column ? order : false}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleSortRequest(column)}
                  >
                    <p className="uppercase">{column}</p>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRecords?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((record, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  {columns?.map((column) => (
                    <TableCell key={column}>{record[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={records?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ViewCsv;
