import React, { useState } from "react";
import { styled } from "@mui/system";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful! Redirecting to login page.");
        navigate("/login");
        // Optionally, you can redirect the user or perform other actions.
      } else if (response.status === 400) {
        alert("Username or email already taken. Please choose another.");
      } else {
        alert("Registration failed. Please try again.");
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
          Register
        </Typography>
        <StyledForm>
          <TextField
            label="First Name"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
          <TextField
            label="Last Name"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
          <TextField
            label="Username"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Register;
