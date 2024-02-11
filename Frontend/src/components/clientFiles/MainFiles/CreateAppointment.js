import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardComponent from '../HelperFiles/Card';
import Filter from '../HelperFiles/Filter';
import ibtasamImg from '../../../assets/images/ibtasam-fyp.jpg';
import usiadImg from '../../../assets/images/usaid.png';
import './mainFiles.css';

const notariesInformation = [
  {
    id: 1,
    image: ibtasamImg,
    notaryName: 'A.Nawaz Osmani Law Associates',
    address: '2-Model Town, Lahore.',
    totalDocNotarized: 50,
    amount: 'Rs. 250'
  },
  {
    id: 2,
    image: usiadImg,
    notaryName: 'XYZ Law Firm',
    address: '5-Downtown, Karachi.',
    totalDocNotarized: 30,
    amount: 'Rs. 200'
  },
  {
    id: 3,
    image: ibtasamImg,
    notaryName: 'ABC Legal Services',
    address: '8-Civil Lines, Islamabad.',
    totalDocNotarized: 40,
    amount: 'Rs. 300'
  }
];

const CreateAppointment = () => {
  return (
    <Box >
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Create Appointment
        </Typography>
        <Typography variant="h5" className="subtitle">
          Notary Officers
        </Typography>
      </Box>

      <Box className="createAppointmentContainer">
        <Filter />
        <CardComponent notariesInformation={notariesInformation} />
      </Box>
    </Box>
  );
};

export default CreateAppointment;
