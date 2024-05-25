import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CardU from "../HelperFiles/CardU";
import "./mainFiles.css";
import axios from "axios";

const notariesPaymentInformation = [
  {
    id: 1,
    notaryName: "A.Nawaz Osmani Law Associates",
    date: "12/12/2021",
    time: "12:00 PM",
    amount: "Rs. 250",
  },
  {
    id: 2,
    notaryName: "All Pakistan Lawyers Associates",
    date: "12/12/2021",
    time: "11:00 PM",
    amount: "Rs. 250",
  },
  {
    id: 3,
    notaryName: "Qureshi Law Associates",
    date: "12/12/2021",
    time: "10:00 PM",
    amount: "Rs. 250",
  },
];

const UnpaidAppointments = () => {
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/unpaidAppointments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Unpaid appointments:", response.data);
      } catch (error) {
        console.error("Error fetching unpaid appointments:", error);
      }
    };

    getAppointments();
  }, []);
  return (
    <Box className="unpaidAppointmentsContainer">
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Unpaid Appointment
        </Typography>
      </Box>

      <Box className="contentSection">
        <CardU notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UnpaidAppointments;
