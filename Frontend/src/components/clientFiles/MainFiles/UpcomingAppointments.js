import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardUp from "../HelperFiles/CardUp";
import "./mainFiles.css"; // Import CSS file
import { useEffect, useState } from "react";
import axios from "axios";

const UpcomingAppointments = () => {
  const [notariesPaymentInformation, setNotariesPaymentInformation] = useState(
    []
  );
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/upcomingAppointment",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Notary Payment Information before:", response.data);
        const notaryPaymentInformation = response.data.map(
          (appointment, index) => {
            return {
              id: appointment.notaryAvailabilityIds,
              appId: appointment.AppointmentId,
              notaryName: appointment.notaryObj.notaryName,
              date: appointment.AppointmentData.date,
              time: appointment.AppointmentData.timeSlot,
              amount: appointment.notaryObj.amount,
              image: appointment.notaryObj.image,
            };
          }
        );
        console.log(
          "Notary Payment Information After:",
          notaryPaymentInformation
        );
        // Update the state with the fetched data
        setNotariesPaymentInformation(notaryPaymentInformation);
      } catch (error) {
        console.error("Error fetching unpaid appointments:", error);
      }
    };

    getAppointments();
  }, []);
  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="upcomingAppointmentTitle">
          Upcoming Appointment
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardUp notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UpcomingAppointments;
