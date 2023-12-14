import React, { useState } from "react";
import { styled } from "@mui/system";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const StyledContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh", // Adjusted height
});

const StyledPaper = styled(Paper)({
  padding: (theme) => theme.spacing(3),
  width: "100%",
  textAlign: "center",
});

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: (theme) => theme.spacing(2),
});

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        const { token, user } = userData;
        onLogin(userData); // Send user data back to App component
        navigate("/");
        return (
          <>
            <Alert severity="success">You have successfully logged in</Alert>
          </>
        );
        // Optionally, you can redirect the user or perform other actions.
      } else {
        const errorData = await response.json();
        alert(`Login failed. ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <StyledForm>
          <TextField
            label="Username"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login;
