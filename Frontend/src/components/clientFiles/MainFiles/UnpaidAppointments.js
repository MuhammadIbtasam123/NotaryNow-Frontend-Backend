import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CardU from "../HelperFiles/CardU";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mainFiles.css";
import axios from "axios";

const UnpaidAppointments = () => {
  const [notariesPaymentInformation, setNotariesPaymentInformation] =
    React.useState([]);
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

        // console.log("Unpaid appointments:", response.data);
        if (response.status === 200) {
          // Show a success toast message
          const notaryPaymentInformation = response.data.map(
            (appointment, index) => {
              return {
                id: appointment.notaryAvailabilityIds,
                notaryName: appointment.notaryObj.notaryName,
                date: appointment.AppointmentData.date,
                time: appointment.AppointmentData.timeSlot,
                amount: appointment.notaryObj.amount,
                image: appointment.notaryObj.image,
              };
            }
          );

          console.log("Notary Payment Information:", notaryPaymentInformation);
          // Update the state with the fetched data
          setNotariesPaymentInformation(notaryPaymentInformation);
          // showToast("User data updated successfully!", "success");
        }
      } catch (error) {
        if (notariesPaymentInformation.length === 0) {
          showToast("No unpaid appointments found!", "info");
          return;
        }
        console.error("Error fetching unpaid appointments:", error);
        showToast("Error fetching unpaid appointments", "error");
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
      <ToastContainer />
    </Box>
  );
};

export default UnpaidAppointments;
