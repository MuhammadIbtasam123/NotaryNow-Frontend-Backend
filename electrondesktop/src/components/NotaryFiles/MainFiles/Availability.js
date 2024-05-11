import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "./mainFiles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState([
    { day: "Monday", available: false, startTime: "", endTime: "" },
    { day: "Tuesday", available: false, startTime: "", endTime: "" },
    { day: "Wednesday", available: false, startTime: "", endTime: "" },
    { day: "Thursday", available: false, startTime: "", endTime: "" },
    { day: "Friday", available: false, startTime: "", endTime: "" },
  ]);

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

  const [openDialog, setOpenDialog] = useState(true);
  const [fetchedAvailability, setFetchedAvailability] = useState([]);

  const handleAvailabilityChange = (index) => (event) => {
    const newAvailability = [...availability];
    newAvailability[index].available = event.target.checked;
    setAvailability(newAvailability);
  };

  const handleStartTimeChange = (index) => (event) => {
    const newAvailability = [...availability];
    newAvailability[index].startTime = event.target.value;
    setAvailability(newAvailability);
  };

  const handleEndTimeChange = (index) => (event) => {
    const newAvailability = [...availability];
    newAvailability[index].endTime = event.target.value;
    setAvailability(newAvailability);
  };

  const handleSubmit = async () => {
    console.log(availability);

    // axios to be used here
    const response = await axios.post(
      "http://localhost:8080/api/AvailabilityForm",
      availability,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      showToast("Availability Submitted Successfully", "success");
    }

    console.log(response.data);
  };
  const handleSeeAvailability = () => {
    setOpenDialog(true);
  };

  const handleEditAvailability = async () => {
    try {
      // axios to be used here
      const response = await axios.patch(
        "http://localhost:8080/api/EditNotaryAvailability",
        availability,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      console.log(response.status);
      // show success message uisng toast
      if (response.status === 200) {
        showToast("Availability Updated Successfully", "success");
      }

      if (response.status === 400) {
        showToast("Please Upload the data", "error");
      }
      // open dialog to show updated availability
      setOpenDialog(true);
    } catch (error) {
      showToast("Please Upload the data", "error");
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/NotaryAvailability",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setFetchedAvailability(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    if (openDialog) {
      fetchAvailability();
    }
  }, [openDialog]);

  return (
    <>
      <Box className="headerSection">
        <Typography variant="h5" className="title title-space">
          Notary Availability Form
        </Typography>
      </Box>
      <Box p={3}>
        <Grid container spacing={2}>
          {availability.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.available}
                    onChange={handleAvailabilityChange(index)}
                  />
                }
                label={item.day}
              />
              {item.available && (
                <Box>
                  <TextField
                    label="Start Time"
                    variant="outlined"
                    fullWidth
                    value={item.startTime}
                    onChange={handleStartTimeChange(index)}
                    type="time"
                    inputProps={{ step: 1800 }} // 30 minutes step
                  />
                  <TextField
                    label="End Time"
                    variant="outlined"
                    fullWidth
                    value={item.endTime}
                    onChange={handleEndTimeChange(index)}
                    type="time"
                    inputProps={{ step: 1800 }} // 30 minutes step
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            style={{
              marginLeft: "15px",
            }}
            variant="contained"
            color="primary"
            onClick={handleSeeAvailability}
          >
            See Availability
          </Button>
          <Button
            style={{
              marginLeft: "15px",
            }}
            variant="contained"
            color="primary"
            onClick={handleEditAvailability}
          >
            Edit Availability
          </Button>
        </Box>
      </Box>
      {/* Dialog for displaying availability */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="dialogTitle">Notary Availability</DialogTitle>
        <DialogContent className="dialogContent">
          <div className="tableContainer">
            <table className="availabilityTable">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Day</th>
                  <th style={{ textAlign: "left" }}>Start Time</th>
                  <th style={{ textAlign: "left" }}>End Time</th>
                </tr>
              </thead>
              <tbody>
                {/* Display fetched availability here */}
                {fetchedAvailability.map((item, index) => (
                  <tr key={index}>
                    <td className="availabilityDay">{item.day}</td>
                    <td className="availabilityTime">{item.startTime}</td>
                    <td className="availabilityTime">{item.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default AvailabilityForm;
