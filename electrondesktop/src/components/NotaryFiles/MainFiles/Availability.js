import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "./mainFiles.css";

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState([
    { day: "Monday", available: false, startTime: "", endTime: "" },
    { day: "Tuesday", available: false, startTime: "", endTime: "" },
    { day: "Wednesday", available: false, startTime: "", endTime: "" },
    { day: "Thursday", available: false, startTime: "", endTime: "" },
    { day: "Friday", available: false, startTime: "", endTime: "" },
  ]);

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
    console.log(response.data);
  };

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
                    inputProps={{ step: 600 }} // 10 minutes step
                  />
                  <TextField
                    label="End Time"
                    variant="outlined"
                    fullWidth
                    value={item.endTime}
                    onChange={handleEndTimeChange(index)}
                    type="time"
                    inputProps={{ step: 600 }} // 10 minutes step
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
        </Box>
      </Box>
    </>
  );
};

export default AvailabilityForm;
