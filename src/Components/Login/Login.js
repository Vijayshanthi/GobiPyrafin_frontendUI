import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, makeStyles, ThemeProvider } from "@mui/material/styles";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import logoImage from "../../assets/Images/horizontal.png";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const defaultTheme = createTheme();

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z]+\.[A-Za-z]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when login starts

    const emailAlert = document.querySelector(".email-alert");
    emailAlert.style.display = "none";

    if (!isEmailValid(formData.email)) {
      window.alert("Invalid email format. Please enter a valid email address.");
      emailAlert.style.display = "block"; // Show the alert
      setLoading(false); // Set loading to false if there's an error
      return;
    }

    try {
      const response = await axios.post(
        "http://188.166.228.50:8089/login/api/login",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("tokenauth", response.data.token);
        window.alert("Login successful");
        // ... other logic ...
        navigate("/layout");
      } else {
        window.alert("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.alert("Invalid email or password.");
      } else {
        console.error("Error creating user:", error);
        window.alert("An error occurred");
      }
    } finally {
      setTimeout(() => {

      setLoading(false); 
    }, 2000);

    }
  }
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked); // Update "Remember me" state when the checkbox changes
  };

  const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: "black", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    animationDuration: "-S50ms", 
  }));


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="transparent-box">
            <img src={logoImage} alt="Your Logo" />
            <Typography
              sx={{
                fontSize: "150%",
                color: "secondary",
                padding: "10px",
                fontFamily: "Vazir",
                color: "Black",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              PYRA - FIN
            </Typography>
            <Typography
              sx={{
                fontSize: "150%",
                color: "secondary",
                fontFamily: "Vazir",
                color: "Black",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Sign-in
            </Typography>
            {loading ? <StyledCircularProgress size={80} /> :(
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
                <div className="email-alert">Invalid email format. Please enter a valid email address.</div>
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    type={type}
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <span className="eye-icon" onClick={handleToggle} style={{ position: "relative", top: "-45px", left: "260px" }}>
                    <Icon className="absolute mr-10" icon={icon} size={25} />
                  </span>
                </div>
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Box>
            )}
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login; 