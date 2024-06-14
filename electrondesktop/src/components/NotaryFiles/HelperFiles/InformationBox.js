import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import "./HelperStyle.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./HelperStyle.css";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { convertToBase64 } from "../HelperFunctions/helperFunctions.js";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

const InformationBox = ({ selectedImage, setSelectedImage }) => {
  const PersonalInforamtionAttributes = [
    "Name", // initial
    "Contact", // initial
    "Email", // initial
    "Address",
    "CNIC", //initial
    "UserName",
    "Stamp",
    "License",
  ];

  const [username, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [License, setLicense] = useState("");
  const [SealIssue, setSealIssue] = useState("");
  const [stamp, setStamp] = useState("");
  const [PersonalInformationData, setPersonalInformationData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

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
      setOpenDialog(false); // Close the dialog

      // Send a PUT request to the backend to update the user data
      const response = await axios.put(
        "http://localhost:8080/api/updateNotary",
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
        //set new updated data
        const UserUpdatedData = response.data.user;
        // Update the user data in the state
        setPersonalInformationData([
          UserUpdatedData.name,
          UserUpdatedData.contact,
          UserUpdatedData.email,
          UserUpdatedData.address,
          UserUpdatedData.cnic,
          UserUpdatedData.notary_name,
          "",
          UserUpdatedData.license,
        ]);

        setSelectedImage(UserUpdatedData.profileImage);
        // Show a success toast message
        showToast("notary data updated successfully!", "success");
        // Close the dialog
        setOpenDialog(false);
      } else {
        // Handle unsuccessful response (e.g., user not found)
        showToast(
          "Failed to update notary data. Please try again later!",
          "error"
        );
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error updating notary data:", error);
      showToast("Error updating notary data. Please try again later!", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/notary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          // Extract the user data from the response
          const userData = response.data;

          if (userData.stampImage) {
            const blob = new Blob([new Uint8Array(userData.stampImage.data)], {
              type: "image/jpeg",
            });
            const imageUrl = URL.createObjectURL(blob);
            setStamp(imageUrl);
          }

          const personalData = [
            userData.name,
            userData.contact,
            userData.email,
            userData.address,
            userData.cnic,
            userData.notary_name,
            "",
            userData.license,
          ];
          setSelectedImage(userData.profileImage);
          // Update the state with the user data
          setPersonalInformationData(personalData);
        } else {
          // Handle unsuccessful response
          showToast(
            "Failed to fetch notary data. Please try again later!",
            "error"
          );
        }
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error("Error fetching notary data:", error);
        showToast("Error fetching user data. Please try again later!", "error");
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  return (
    <Box className="information-box">
      <Box
        className="information-box-heading"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography className="information-header">
          Personal Information
        </Typography>
        <ModeEditOutlineOutlinedIcon
          className="information-box-edit"
          onClick={handleEdit}
          style={{
            marginRight: "1rem",
          }}
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

          <Grid xs={8}>
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
        <img src={stamp} alt="" />
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
