import React, { useState } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ResetPasswordPage = ({ token }) => {
  const theme = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleResetPassword = async () => {
    console.log(newPassword, confirmPassword);
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    try {
      // Extract the token from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const response = await axios.put(
        `http://localhost:8080/api/notaryresetPassword/${token}`,
        {
          newPassword,
        }
      );
      console.log(response.data); // Handle success
      showToast("Password reset successfully", "success");
    } catch (error) {
      console.error("Error resetting password:", error);
      showToast("Error resetting password. Please try again.", "error"); // Handle error
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: theme.spacing(3) }}>
      <Typography variant="h4" gutterBottom>
       Notary Reset Password
      </Typography>
      <form>
        <TextField
          type="password"
          label="Enter new password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          type="password"
          label="Confirm new password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          fullWidth
        >
         Notary Reset Password
        </Button>
      </form>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
