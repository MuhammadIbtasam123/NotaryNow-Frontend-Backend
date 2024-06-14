import axios from "axios";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import "./index.css";
import UserImg from "../../assets/images/USer.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ AccountName }) => {
  // Dynamic states for input fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const history = useHistory();

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

  const handleRegister = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmpassword ||
      !cnic
    ) {
      showToast("Please fill all the fields", "error");
      return;
    }

    // Check if password and confirm password are same
    if (password !== confirmpassword) {
      showToast("Password and Confirm Password are not the same", "error");
      return;
    }

    // Check if CNIC is valid
    if (cnic.length !== 13) {
      showToast("CNIC should be 13 digits", "error");
      return;
    }
    const cnicFormat = `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(
      12,
      13
    )}`;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/notarysignup",
        {
          name: name,
          username: username,
          email: email,
          password: password,
          cnic: cnicFormat,
          contact: contact,
          licenseNumber: licenseNumber,
        }
      );

      if (response.status === 200) {
        showToast("Signup Successful!", "success");
        // redirect to Landing page using react router
        setTimeout(() => {
          history.push("/generateCertificate");
        }, 2500);
      } else if (response.status === 500) {
        showToast("Error SignUp!", "error");
      }
    } catch (error) {
      showToast("Error SignUp!", "error");
    }
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
            Sign Up
          </Typography>
          {/* Username */}
          <input
            id="name"
            type="text"
            placeholder="name"
            className="text-field"
            name="username"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {/* Username */}
          <input
            id="username"
            type="text"
            placeholder="Notary_name"
            className="text-field"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />

          {/* email */}
          <input
            id="email"
            type="email"
            f
            placeholder="Email"
            className="text-field"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />

          {/* Password */}
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

          {/* Confirm password */}
          <input
            id="confirmpassword"
            type="password"
            placeholder="Confirm Password"
            className="text-field"
            name="confirmpassword"
            value={confirmpassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />

          {/* CNIC */}
          <input
            id="cnic"
            type="text"
            placeholder="CNIC"
            className="text-field"
            name="cnic"
            maxLength="13"
            value={cnic}
            onChange={(event) => {
              const userInput = event.target.value;
              const regex = /^[0-9]*$/; // Regular expression to allow only numeric input
              (regex.test(userInput) || userInput === "") && setCnic(userInput);
            }}
          />

          {/* Contact */}

          <input
            id="contact"
            type="text"
            placeholder="Contact"
            className="text-field"
            name="contact"
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
            }}
          />

          {/* License Number */}

          <input
            id="licenseNumber"
            type="text"
            placeholder="License Number"
            className="text-field"
            name="licenseNumber"
            value={licenseNumber}
            onChange={(event) => {
              setLicenseNumber(event.target.value);
            }}
          />

          <button
            className="login-button"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>

          <Link to={"/LoginNotary"} className="forgot-password">
            Have an account? Login
          </Link>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Signup;
