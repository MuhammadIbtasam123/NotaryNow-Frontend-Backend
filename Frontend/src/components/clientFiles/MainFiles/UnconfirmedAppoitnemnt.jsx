import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardUNC from "../HelperFiles/CardUNC";
import "./mainFiles.css"; // Import CSS file
import { useEffect, useState } from "react";
import axios from "axios";

const UnconfirmedAppointments = () => {
  const [notariesPaymentInformation, setNotariesPaymentInformation] = useState(
    []
  );
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/unconfirmedAppointment",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Unpaid appointments:", response.data);
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
          Unconfirmed Appointments
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardUNC notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UnconfirmedAppointments;
