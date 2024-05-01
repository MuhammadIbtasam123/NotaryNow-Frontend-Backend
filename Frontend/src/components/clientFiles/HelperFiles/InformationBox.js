import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import "./HelperStyle.css";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import convertToBase64 from "../../helperFunctions/helperFunctions.js";

//functiona component
const InformationBox = ({ selectedImage, setSelectedImage }) => {
  // states
  const PersonalInforamtionAttributes = [
    "UserName",
    "Name",
    "Email",
    "Contact",
    "Address",
    "CNIC",
  ];
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [PersonalInformationData, setPersonalInformationData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
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
  const handleEdit = (event) => {
    setOpenDialog(true); // Open the dialog on Edit button click
  };

  const handleCloseDialog = (event) => {
    setOpenDialog(false); // Close the dialog
  };

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setSelectedImage(base64);
  };

  const handleSaveChanges = async () => {
    try {
      console.log(
        "Address:",
        address,
        "Contact:",
        contact
        // "Image:",
        // selectedImage
      );
      setOpenDialog(false); // Close the dialog

      // Send a PUT request to the backend to update the user data
      const response = await axios.put(
        "http://localhost:8080/api/updateUser",
        {
          address,
          contact,
          selectedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Check the response status
      if (response.status === 200) {
        // Show a success toast message
        showToast("User data updated successfully!", "success");
        const UserUpdatedData = response.data.user;
        // console.log("UserUpdatedData", UserUpdatedData);
        // Update the user data in the state
        setPersonalInformationData([
          UserUpdatedData.username,
          UserUpdatedData.name,
          UserUpdatedData.email,
          UserUpdatedData.contact,
          UserUpdatedData.address,
          UserUpdatedData.cnic,
        ]);
        console.log(response.data);
        // Close the dialog
        setOpenDialog(false);
      } else {
        // Handle unsuccessful response (e.g., user not found)
        showToast(
          "Failed to update user data. Please try again later!",
          "error"
        );
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error updating user data:", error);
      showToast("Error updating user data. Please try again later!", "error");
    }
  };

  useEffect(() => {
    // Define an asynchronous function inside the useEffect
    const fetchData = async () => {
      try {
        // Fetch user data from the backend
        const response = await axios.get("http://localhost:8080/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Check the response status
        if (response.status === 200) {
          // Extract the user data from the response
          const userData = response.data;
          const personalData = [
            userData.username,
            userData.name,
            userData.email,
            userData.contact,
            userData.address,
            userData.cnic,
          ];
          setSelectedImage(userData.profileImage);
          // Update the state with the user data
          setPersonalInformationData(personalData);
        } else {
          // Handle unsuccessful response (e.g., user not found)
          showToast(
            "Failed to fetch user data. Please try again later!",
            "error"
          );
        }
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error("Error fetching user data:", error);
        showToast("Error fetching user data. Please try again later!", "error");
      }
    };

    // Immediately invoke the asynchronous function
    fetchData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <Box className="information-box">
      <Box className="information-box-heading">
        <Typography className="information-header">
          Personal Information
        </Typography>
        <ModeEditOutlineOutlinedIcon
          className="information-box-edit"
          onClick={handleEdit}
        />
      </Box>
      <Grid container className="information-grid">
        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInforamtionAttributes.map(
              (element, index) =>
                index % 2 === 0 && (
                  <Typography className="information-attribute" key={index}>
                    <strong>{element}:</strong>
                  </Typography>
                )
            )}
          </Grid>
          <Grid xs={6}>
            {PersonalInformationData.map(
              (element, index) =>
                index % 2 === 0 && (
                  <Typography className="information-value" key={index}>
                    {element}
                  </Typography>
                )
            )}
          </Grid>
        </Grid>

        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInforamtionAttributes.map(
              (element, index) =>
                index % 2 !== 0 && (
                  <Typography className="information-attribute" key={index}>
                    <strong>{element}:</strong>
                  </Typography>
                )
            )}
          </Grid>

          <Grid xs={6}>
            {PersonalInformationData.map(
              (element, index) =>
                index % 2 !== 0 && (
                  <Typography className="information-value" key={index}>
                    {element}
                  </Typography>
                )
            )}
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        className="custom-dialog"
      >
        <DialogTitle
          sx={{
            margin: "auto",
          }}
        >
          Edit Personal Information
        </DialogTitle>
        <DialogContent>
          {/* Replace with your form fields or editing components */}
          <TextField
            sx={{
              marginTop: "2rem",
            }}
            label="Address"
            defaultValue={PersonalInformationData[1]}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <TextField
            sx={{
              marginTop: "2rem",
            }}
            label="Contact"
            defaultValue={PersonalInformationData[3]}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
          {/* field to browse image */}
          <Button
            sx={{
              marginTop: "2rem",
            }}
            className="Dialog-edit"
            size="small"
            variant="outlined"
            component="label"
          >
            Upload Image
            <input
              className="Dialog-edit"
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => onUpload(event)}
            />
          </Button>
          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default InformationBox;
