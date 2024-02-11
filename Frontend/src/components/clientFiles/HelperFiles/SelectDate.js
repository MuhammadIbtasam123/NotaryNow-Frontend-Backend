import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import BoxDateTime from './BoxDateTime';
import './HelperStyle.css';

const days = ['Today', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const date = new Date().toLocaleDateString();

const SelectDate = () => {
  return (
    <>
      <Typography variant='h5' className='selectDateTitle'>
        Select Date
      </Typography>

      <Box className='selectDateContainer'>
        <BoxDateTime days={days} date={date} />
      </Box>
    </>
  );
};

export default SelectDate;
