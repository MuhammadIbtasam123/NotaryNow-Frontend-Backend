import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardU from '../HelperFiles/CardU';
import './mainFiles.css'; // Import CSS file

const notariesPaymentInformation = [{
  id: 1,
  notaryName: 'A.Nawaz Osmani Law Associates',
  date: '12/12/2021',
  time: '12:00 PM',
  amount: 'Rs. 250'
},{
  id: 2,
  notaryName: 'All Pakistan Lawyers Associates',
  date: '12/12/2021',
  time: '11:00 PM',
  amount: 'Rs. 250'
},{
  id: 3,
  notaryName: 'Qureshi Law Associates',
  date: '12/12/2021',
  time: '10:00 PM',
  amount: 'Rs. 250'
}]

const UpcomingAppointments = () => {
  return (
    <Box>
      <Box className="headerSection">
        <Typography 
          variant='h5'
          className="upcomingAppointmentTitle"
        >
          Upcoming Appointment
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardU notariesPaymentInformation={notariesPaymentInformation} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments;
