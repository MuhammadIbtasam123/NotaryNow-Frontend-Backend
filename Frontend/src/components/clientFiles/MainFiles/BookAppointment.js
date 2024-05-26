import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CardComponent from "../HelperFiles/Card";
import DateTime from "../HelperFiles/DateTime";
import Button from "@mui/material/Button";
import "./mainFiles.css";
import axios from "axios";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const BookAppointment = () => {
  const [notaryInfo, setNotaryInfo] = useState([]);
  const [DayTime, setDayTime] = useState([]);
  const [BookedSlots, setBookedSlots] = useState([]);
  const [NID, setNID] = useState(null);
  // get the data of notary against specific id.
  const { id } = useParams();

  useEffect(() => {
    const FetchNotaryData = async () => {
      try {
        // get the id from params
        const response = await axios.get(
          `http://localhost:8080/api/getNotaries/${id}`
        );
        setNotaryInfo([response.data[0].data]);
        setDayTime(response.data[0].dayTimeDataGroupedArray);
        setBookedSlots(response.data[0].BookedDate);
        setNID(id);
        console.log(response.data[0].BookedDate);
      } catch (error) {
        console.log(error);
      }
    };
    FetchNotaryData();
  }, [id]);
  return (
    <Box>
      <Box className="headingContainer">
        <Typography variant="h5" className="headingText">
          Create Appointment
        </Typography>
        <Typography variant="h5" className="subHeadingText">
          {notaryInfo.notaryName}
        </Typography>
      </Box>

      <Box className="mainContainer">
        <CardComponent notariesInformation={notaryInfo} />
        <DateTime dayTime={DayTime} BookedSlots={BookedSlots} NID={NID} />
      </Box>
    </Box>
  );
};

export default BookAppointment;
