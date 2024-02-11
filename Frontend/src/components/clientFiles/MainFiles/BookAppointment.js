import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import CardComponent from '../HelperFiles/Card';
import ibtasamImg from '../../../assets/images/ibtasam-fyp.jpg';
import SelectDate from '../HelperFiles/SelectDate';
import SelectTime from '../HelperFiles/SelectTime';
import Button from '@mui/material/Button';
import './mainFiles.css';

const notariesInformation = [
  {
    id: 1,
    image: ibtasamImg,
    notaryName: 'A.Nawaz Osmani Law Associates',
    address: '2-Model Town, Lahore.',
    totalDocNotarized: 50,
    amount: 'Rs. 250'
  }
];

const BookAppointment = () => {
  return (
    <Box>
      <Box className="headingContainer">
        <Typography variant="h5" className="headingText">
          Create Appointment
        </Typography>
        <Typography variant="h5" className="subHeadingText">
          {notariesInformation[0].notaryName}
        </Typography>
      </Box>

      <Box className="mainContainer">
        <CardComponent notariesInformation={notariesInformation} />
        <SelectDate />
        <SelectTime />

        <Button className="bookButton">
          Book Appointment
        </Button>
      </Box>
    </Box>
  );
}

export default BookAppointment;
