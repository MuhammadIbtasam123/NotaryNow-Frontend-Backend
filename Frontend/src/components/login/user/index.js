import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import UserImg from "../../../assets/images/USer.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ AccountName }) => {
  // Dynamic states for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [openModal, setOpenModal] = useState(false); // State to control modal display
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

  // handling login request
  const handleLogin = async (event) => {
    event.preventDefault();
    // Check if any field is empty
    if (!email || !password) {
      showToast("Please fill all the fields", "error");
      return;
    }

    try {
      // sending login requet to backend on endpoint /login using axios
      const response = await axios.post("http://localhost:8080/api/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // notification for successful login
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem("token", token);
        setOpenModal(true); // Open OTP verification modal upon successful login
        // redirect to dashboard page
        // window.location.href = "/User";
        showToast("Login Successful!", "success");
      } else if (response.status === 500) {
        // notification for unsuccessful signup
        // redirect to login page again with error message
        showToast("Error Login!", "error");
      }
    } catch (error) {
      // console.log(error)
      showToast("Email or Password incoorect !", "error");
    }
  };

  // handling OTP verification

  const HandleVerifyOTP = async () => {
    // Add your OTP verification logic here
    const response = await axios.post(
      "http://localhost:8080/api/verifyOTP",
      {}
    );
    // If OTP is verified successfully, close the modal
    setOpenModal(false);
    showToast("OTP Verified Successfully!", "success");
  };

  return (
    <Box className="LoginContainer">
      <Box className="LoginBox">
        <Box className="LoginUserImg">
          <img src={UserImg} alt="User" className="LoginImg" />
          <Typography variant="h6" className="LoginUserImgName" gutterbottom>
            {`${AccountName} Account`}
          </Typography>
        </Box>
        <Box className="LoginUserData">
          <Typography gutterBottom variant="h5">
            Login
          </Typography>
          <input
            type="text"
            placeholder="Enter you email"
            className="text-field"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="text-field"
            name="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button className="login-button" type="button" onClick={handleLogin}>
            Login
          </button>
          <Link href="#" className="forgot-password">
            Forgot Password?
          </Link>
          <Link to="/SignupClient" className="forgot-password">
            Don't have an account? Signup
          </Link>
        </Box>
      </Box>
      {/* OTP Verification Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="otp-verification-modal"
        aria-describedby="otp-verification-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            OTP Verification
          </Typography>
          <Typography
            variant="body1"
            id="otp-verification-modal-description"
            sx={{ mb: 2 }}
          >
            Please enter the OTP sent to your registered email/mobile number.
          </Typography>
          {/* Add your OTP input field and verification button here */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="text-field"
            name="otp"
          />
          <button
            onClick={HandleVerifyOTP}
            className="login-button"
            type="button"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value);
            }}
          >
            Verify OTP
          </button>
        </Box>
      </Modal>
      <ToastContainer />
    </Box>
  );
};

export default Login;
