// import { useState } from "react";
// import axios from "axios";
// import { Box } from "@mui/material";
// import Typography from "@mui/material/Typography";
// import React from "react";
// import "./index.css";
// import { Link } from "react-router-dom";
// import UserImg from "../../assets/images/USer.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = ({ AccountName }) => {
//   // Dynamic states for input fields
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  
//   // const [showToast, setShowToast] = useState(false);

//   const showToast = (message, type) => {
//     toast[type](message, {
//       position: "top-center",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   // handling login request
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     // Check if any field is empty
//     if (!email || !password) {
//       showToast("Please fill all the fields", "error");
//       return;
//     }

//     try {
//       // sending login requet to backend on endpoint /login using axios
//       const response = await axios.post("http://localhost:8080/api/login", {
//         email: email,
//         password: password,
//       });

//       if (response.status === 200) {
//         // notification for successful login
//         const token = response.data.token;
//         localStorage.setItem("token", token);

//         // Generate OTP after successful login
//         axios.post("http://localhost:8080/api/generateOTP", {
//           email: email,
//           // sending the token from local storage to backend for verification
//           token: localStorage.getItem("token"),
//         });
//         // console.log(email);
//         setOpenModal(true); // Open OTP verification modal upon successful login
//       } else if (response.status === 500) {
//         // notification for unsuccessful login
//         showToast("Error Login!", "error");
//       }
//     } catch (error) {
//       showToast("Email or Password incorrect !", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // handling OTP verification
//   const handleOTP = async () => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/verifyOTP", {
//         otp: otp,
//       });

//       if (response.status === 200) {
//         setOpenModal(false);

//         // halt to move to user page after successful OTP verification using setTimeout
//         showToast("OTP Verified Successfully!", "success");
//         // Redirect user to /user route after successful OTP verification
//         setTimeout(() => {
//           history.push("/user");
//         }, 3000);
//       } else {
//         showToast("OTP Verification Failed!", "error");
//       }
//     } catch (error) {
//       showToast("Error verifying OTP!", "error");
//     }
//   };

//   // Resend OTP function
//   const resendOTP = async () => {
//     try {
//       await axios.post("http://localhost:8080/api/generateOTP", {
//         email: email,
//         token: localStorage.getItem("token"),
//       });
//       showToast("OTP Resent Successfully!", "success");
//     } catch (error) {
//       showToast("Error resending OTP!", "error");
//     }
//   };

//   const forgotPassword = async () => {
//     try {
//       // email validation
//       if (!email) {
//         showToast("Please enter your email!", "error");
//         return;
//       }

//       await axios.put("http://localhost:8080/api/forgotPassword", {
//         email: email,
//       });

//       showToast("Password reset link sent to your email!", "success");
//     } catch (error) {
//       showToast("Error sending reset link!", "error");
//     }
//   };

//   return (
//     <Box className="LoginContainer">
//       <Box className="LoginBox">
//         <Box className="LoginUserImg">
//           <img src={UserImg} alt="User" className="LoginImg" />
//           <Typography variant="h6" className="LoginUserImgName" gutterbottom>
//             {`${AccountName} Account`}
//           </Typography>
//         </Box>
//         <Box className="LoginUserData">
//           <Typography gutterBottom variant="h5">
//             Login
//           </Typography>
//           <input
//             type="text"
//             placeholder="Enter you email"
//             className="text-field"
//             name="email"
//             value={email}
//             onChange={(event) => {
//               setEmail(event.target.value);
//             }}
//           />
//           <input
//             id="password"
//             type="password"
//             placeholder="Password"
//             className="text-field"
//             name="password"
//             value={password}
//             onChange={(event) => {
//               setPassword(event.target.value);
//             }}
//           />
//           <button className="login-button" type="button" onClick={handleLogin}>
//             Login
//           </button>
//           <Link to="/Notary" href="#" className="forgot-password">
//             Forgot Password?
//           </Link>
//           <Link to={"/SignupNotary"} className="forgot-password">
//             Don't have an account? Signup
//           </Link>
//         </Box>
//       </Box>
//       <ToastContainer />
//     </Box>
//   );
// };

// export default Login;



import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React from "react";
import "./index.css";
import { Link, useHistory } from "react-router-dom";
import UserImg from "../../assets/images/USer.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ AccountName }) => {
  // Dynamic states for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [openModal, setOpenModal] = useState(false); // State to control modal display
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
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

  // handling login request
  const handleLogin = async (event) => {
    event.preventDefault();
    // Check if any field is empty
    if (!email || !password) {
      showToast("Please fill all the fields", "error");
      return;
    }

    setLoading(true);

    try {
      // sending login request to backend on endpoint /login using axios
      const response = await axios.post("http://localhost:8080/api/notarylogin", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // notification for successful login
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Generate OTP after successful login
        axios.post("http://localhost:8080/api/generateOTP", {
          email: email,
          // sending the token from local storage to backend for verification
          token: localStorage.getItem("token"),
        });
        // console.log(email);
        setOpenModal(true); // Open OTP verification modal upon successful login
      } else if (response.status === 500) {
        // notification for unsuccessful login
        showToast("Error Login!", "error");
      }
    } catch (error) {
      showToast("Email or Password incorrect !", "error");
    } finally {
      setLoading(false);
    }
  };

  // handling OTP verification
  const handleOTP = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/verifyOTP", {
        otp: otp,
      });

      if (response.status === 200) {
        setOpenModal(false);

        // halt to move to user page after successful OTP verification using setTimeout
        showToast("OTP Verified Successfully!", "success");
        // Redirect user to /user route after successful OTP verification
        setTimeout(() => {
          history.push("/Notary");
        }, 3000);
      } else {
        showToast("OTP Verification Failed!", "error");
      }
    } catch (error) {
      showToast("Error verifying OTP!", "error");
    }
  };

  // Resend OTP function
  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:8080/api/generateOTP", {
        email: email,
        token: localStorage.getItem("token"),
      });
      showToast("OTP Resent Successfully!", "success");
    } catch (error) {
      showToast("Error resending OTP!", "error");
    }
  };

  const forgotPassword = async () => {
    try {
      // email validation
      if (!email) {
        showToast("Please enter your email!", "error");
        return;
      }

      await axios.put("http://localhost:8080/api/notaryforgotPassword", {
        email: email,
      });

      showToast("Password reset link sent to your email!", "success");
    } catch (error) {
      showToast("Error sending reset link!", "error");
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
            Login
          </Typography>
          <input
            type="text"
            placeholder="Enter your email"
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
          <button
            className="login-button"
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
          <button to="#" className="forgot-password" onClick={forgotPassword}>
            Forgot Password?
          </button>
          <Link to="/SignupNotary" className="forgot-password">
            Don't have an account? Signup
          </Link>
        </Box>
      </Box>
      {/* OTP Verification Modal */}
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
            style={{
              color: "red",
            }}
          >
            Please enter the OTP sent to your registered email.
          </Typography>
          {/* OTP input field */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="text-field"
            name="otp"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value);
            }}
          />
          {/* Verify OTP button */}
          <button onClick={handleOTP} className="login-button" type="button">
            Verify OTP
          </button>
          {/* Resend OTP button */}
          <button
            onClick={resendOTP}
            className="login-button "
            style={{
              marginTop: "10px",
            }}
            type="button"
          >
            Resend OTP
          </button>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default Login;

