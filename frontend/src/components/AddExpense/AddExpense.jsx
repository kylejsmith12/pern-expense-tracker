import React, { useState } from "react";
import {
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Input,
  Grid,
  Paper,
  Typography,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Alert,
  Snackbar,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";

const categories = [
  "Utilities",
  "Insurance",
  "Cellphone",
  "Amazon",
  "Subscriptions",
  "Miscellaneous",
  "Internet",
  "Cable",
  "Food",
  "Debt",
  "Health Insurance",
  "Restaurants",
  "Clothing",
  "Donations",
  "Housing",
  "Transportation",
  "Travel",
  "Homeowners Insurance",
  "Entertainment",
  "Annual Fee",
  "Gym",
  "Not Listed",
];

const AddExpense = ({ user }) => {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setReceipt(file);
  };

  const handleCustomCategoryChange = (event) => {
    setCustomCategory(event.target.value);
  };

  // Update handleAddExpense function in AddExpense.jsx
  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the data as multipart/form-data
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append(
      "category",
      selectedCategory === "Not Listed" ? customCategory : selectedCategory
    );
    formData.append("date", date);
    formData.append("notes", notes);
    formData.append("user_id", user.id); // Include user ID in the FormData

    // Append receipt only if it exists
    if (receipt) {
      formData.append("receipt", receipt);
    }
    console.log(amount);
    console.log(selectedCategory);
    console.log(date);
    console.log(notes);
    console.log(user.id);
    try {
      const response = await fetch("http://localhost:5001/api/expenses", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {},
      });

      if (response.ok) {
        setAmount("");
        setSelectedCategory("");
        setDate("");
        setReceipt(null);
        setCustomCategory("");
        setNotes("");

        setIsSnackbarOpen(true);
      } else {
        console.error("Error adding expense:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Use the name of the input field to dynamically update the corresponding state variable
    if (name === "amount") {
      setAmount(value);
    } else if (name === "category") {
      // handle category change
      setSelectedCategory(value);
    } else if (name === "date") {
      // handle date change
      setDate(value);
    } else if (name === "notes") {
      // handle notes change
      setNotes(value);
    } else if (name === "Not Listed") {
      setCustomCategory("");
    }
    // Add similar conditions for other form fields...
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff5722", // Deep Orange
      },
      secondary: {
        main: "#4caf50", // Green
      },
      error: {
        main: "#f44336", // Red
      },
      warning: {
        main: "#ffeb3b", // Yellow
      },
      info: {
        main: "#2196f3", // Blue
      },
      success: {
        main: "#8bc34a", // Light Green
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Paper elevation={3} style={{ padding: "40px", marginTop: "40px" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Add Expense
          </Typography>
          <form onSubmit={handleAddExpense}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={handleChange}
                  required
                  InputProps={{
                    inputProps: {
                      step: "0.01",
                      min: "0",
                    },
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={selectedCategory}
                    label="Category"
                    name="category"
                    required
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* If "Not Listed" is chosen, display a text input for custom category */}
                  {selectedCategory === "Not Listed" && (
                    <Input
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={handleCustomCategoryChange}
                    />
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="date"
                  variant="outlined"
                  type="date"
                  name="date"
                  value={date}
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Receipt (Optional)
                </InputLabel>
                <TextField
                  fullWidth
                  label="Notes"
                  variant="outlined"
                  multiline
                  rows={4}
                  name="notes"
                  value={notes}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Receipt (Optional)
                </InputLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Add Expense
            </Button>
          </form>
          <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              Expense added successfully!
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

AddExpense.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default AddExpense;
