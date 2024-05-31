import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardU from "../HelperFiles/CardUP";
import "./mainFiles.css"; // Import CSS file
import axios from "axios";

const UpcomingAppointments = () => {
  const [userPaymentInformation, setUserPaymentInformation] = useState([]);
  useEffect(() => {
    const getUpcomingAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/notaryConfirmedAppointment",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Upcoming appointments:", response.data);
        const userPaymentInformationResponse = await response.data.map(
          (appointment, index) => {
            return {
              id: appointment.AppointmentIds,
              userName: appointment.userObj.userName,
              date: appointment.AppointmentData.date,
              time: appointment.AppointmentData.timeSlot,
              image: appointment.userObj.image,
            };
          }
        );
        console.log(
          "Notary unconfirm appointment Information:",
          userPaymentInformationResponse
        );
        // Update the state with the fetched data
        setUserPaymentInformation(userPaymentInformationResponse);
      } catch (error) {
        console.error("Error fetching unpaid appointments:", error);
      }
    };

    getUpcomingAppointments();
  }, []);
  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="upcomingAppointmentTitle">
          Upcoming Appointment
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardU userPaymentInformation={userPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UpcomingAppointments;
