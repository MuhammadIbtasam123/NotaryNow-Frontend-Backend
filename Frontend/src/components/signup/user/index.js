import axios from "axios";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import "./index.css";
import UserImg from "../../../assets/images/USer.png";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ AccountName }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  // const [frontImage, setFrontImage] = useState(null); // State for front side image
  // const [backImage, setBackImage] = useState(null); // State for back side image
  const [showToastFlag, setShowToastFlag] = useState(false);
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
    if (
      !username ||
      !email ||
      !password ||
      !confirmpassword ||
      !cnic
      // !frontImage ||
      // !backImage
    ) {
      showToast("Please fill all the fields", "error");
      return;
    }

    if (password !== confirmpassword) {
      showToast("Password and Confirm Password are not the same", "error");
      return;
    }

    if (cnic.length !== 13) {
      showToast("CNIC should be 13 digits", "error");
      return;
    }

    const cnicFormat = `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(
      12,
      13
    )}`;

    try {
      console.log({ username, name, email, password, cnicFormat });

      const response = await axios.post("http://localhost:8080/api/signup", {
        username,
        name,
        email,
        password,
        cnic: cnicFormat,
      });

      console.log(response.data);

      if (response.status === 200) {
        showToast(response.data.message, "success");
      } else if (response.status === 400) {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      showToast("Error SignUp!", "error");
    }
  };

  useEffect(() => {
    let timer;
    if (showToastFlag) {
      timer = setTimeout(() => {
        history.push("/login");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showToastFlag, history]);
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
            id="username"
            type="text"
            placeholder="Username"
            className="text-field"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          {/* Name */}
          <input
            id="Name"
            type="text"
            placeholder="Name"
            className="text-field"
            name="Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {/* email */}
          <input
            id="email"
            type="email"
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
          {/* <div className="file-input">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFrontImage(e.target.files[0])}
            />
            <label>Front CNIC</label>
          </div> */}
          {/* Back side image input field */}
          {/* <div className="file-input">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackImage(e.target.files[0])}
            />
            <label>Back CNIC</label>
          </div> */}
          <button
            className="login-button"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
          <Link to="/LoginClient" className="forgot-password">
            Have an account? Login
          </Link>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Signup;

/*
should be the path where server is hosted and listening to,  then /endpint work.
endpoint: http://localhost:3001/signup

*/
