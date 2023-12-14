import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Fetch data from the backend API
    fetch("http://localhost:5001/api/expenses")
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleSearch = (value) => {
    setSearchTerm(value);

    // Filter data based on the search term
    const filtered = expenses.filter((expense) =>
      expense.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSelectAll = () => {
    const allIds = filteredData.map((expense) => expense.id);
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedRows.includes(id);
    let newSelectedRows = [...selectedRows];

    if (isSelected) {
      newSelectedRows = newSelectedRows.filter((rowId) => rowId !== id);
    } else {
      newSelectedRows.push(id);
    }

    setSelectedRows(newSelectedRows);
    setIsAllSelected(newSelectedRows.length === filteredData.length);
  };

  const handleDeleteRow = (id) => {
    // Implement delete row logic here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const convertToLocal = (time) => {
    console.log("in here");
    return new Date(time).toString();
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Expense Data</Typography>
        {/* Implement any additional actions or buttons here */}
      </Box>
      {/* Implement Autocomplete component for search here */}
      {/* Implement Loading spinner during data loading here */}
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="150px"
        >
          <CircularProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="textSecondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      ) : filteredData.length > 0 ? (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              {/* Table header with checkboxes for selection */}
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                {/* Include additional columns based on your expense data */}
                <TableCell>Date</TableCell>
                <TableCell>Receipt</TableCell>
                <TableCell>User ID</TableCell>
                {/* Include additional columns based on your expense data */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {/* Table body with expense data */}
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((expense) => (
                  <TableRow key={expense.id}>
                    {/* Checkbox for row selection */}
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(expense.id)}
                        onChange={() => handleCheckboxChange(expense.id)}
                      />
                    </TableCell>
                    {/* Expense data cells */}
                    <TableCell>{expense.id}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    {/* Include additional cells based on your expense data */}
                    <TableCell>{convertToLocal(expense.date)}</TableCell>
                    <TableCell>{expense.receipt}</TableCell>
                    <TableCell>{expense.user_id}</TableCell>
                    {/* Include additional cells based on your expense data */}
                    {/* Action cell with delete button */}
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteRow(expense.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Message when no expense data is available
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
          flexDirection="column"
        >
          <p>No expense data available.</p>
        </Box>
      )}
      {/* Pagination component for navigating through pages */}
      {filteredData.length > 0 && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default ViewExpenses;
