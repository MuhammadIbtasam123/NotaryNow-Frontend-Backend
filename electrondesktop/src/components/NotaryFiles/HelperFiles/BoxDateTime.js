import React from 'react';
import { Box } from '@mui/material';
import './HelperStyle.css'
const BoxDateTime = ({ days, date, Time }) => {
  return (
    <>
      {days &&
        date &&
        days.map((day, index) => (
          <Box key={index} className={`box-style ${index === 0 ? 'active' : ''}`}>
            {day}
            <br />
            {date}
          </Box>
        ))}
      {Time &&
        Time.map((time, index) => (
          <Box key={index} className={`box-style ${index === 0 ? 'active' : ''}`}>
            {time}
          </Box>
        ))}
    </>
  );
};

export default BoxDateTime;
