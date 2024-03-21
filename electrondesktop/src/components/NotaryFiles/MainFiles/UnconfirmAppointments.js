import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CardU from "../HelperFiles/CardU";
import "./mainFiles.css";

const notariesPaymentInformation = [
  {
    id: 1,
    userName: "Ahmad",
    date: "12/12/2021",
    time: "12:00 PM",
  },
  {
    id: 2,
    userName: "Ali",
    date: "12/12/2021",
    time: "11:00 PM",
  },
  {
    id: 3,
    userName: "Usman",
    date: "12/12/2021",
    time: "10:00 PM",
  },
];

const UnconfirmAppointments = () => {
  return (
    <Box className="unpaidAppointmentsContainer">
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Unconfirm Appointments
        </Typography>
      </Box>

      <Box className="contentSection">
        <CardU notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UnconfirmAppointments;
