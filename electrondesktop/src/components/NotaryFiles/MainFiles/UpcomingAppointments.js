import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardUP from "../HelperFiles/CardUP";
import "./mainFiles.css"; // Import CSS file

const notariesPaymentInformation = [
  {
    id: 1,
    userName: "Muhammad Ibtasam",
    date: "12/12/2021",
    time: "12:00 PM",
  },
  {
    id: 2,
    userName: "Ahmad Azeem",
    date: "12/12/2021",
    time: "11:00 PM",
  },
  {
    id: 3,
    userName: "Jawad Ahmed",
    date: "12/12/2021",
    time: "10:00 PM",
  },
];

const UpcomingAppointments = () => {
  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="upcomingAppointmentTitle">
          Upcoming Appointment
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardUP notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  );
};

export default UpcomingAppointments;
