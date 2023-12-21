import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AddExpense from "./components/AddExpense/AddExpense";
import ViewExpenses from "./components/ViewExpense/ViewExpenses";
import ViewCategories from "./components/ViewCategories/ViewCategories";
import "chart.js/auto";
import Reports from "./components/Reports/Reports";

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser || null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          {user?.user && (
            <>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Button color="inherit">Home</Button>
              </Link>
              <Link
                to="/expenses"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Expenses</Button>
              </Link>
              <Link
                to="/add-expense"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Add Expense</Button>
              </Link>
              <Link
                to="/categories"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Expense Categories</Button>
              </Link>
              <Link
                to="/reports"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Reports</Button>
              </Link>
            </>
          )}
          {!user?.user ? (
            <>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Login</Button>
              </Link>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <LogoutMenu
                onLogout={handleLogout}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
              />
              <Typography
                color="inherit"
                style={{ cursor: "pointer" }}
                onClick={handleMenuOpen}
              >
                {`${user?.user.first_name} ${user?.user.last_name}`}
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<ViewExpenses user={user?.user} />} />
        <Route path="/add-expense" element={<AddExpense user={user?.user} />} />
        <Route
          path="/categories"
          element={<ViewCategories user={user?.user} />}
        />
        <Route path="/reports" element={<Reports user={user?.user} />} />
      </Routes>
    </Router>
  );
}

const LogoutMenu = ({ onLogout, anchorEl, onClose }) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default App;
