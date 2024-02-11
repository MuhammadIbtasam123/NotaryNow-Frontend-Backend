// Missing.js

import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import img404 from '../../../assets/images/404.jpg';
import './Missing'; // Import the CSS file

const Missing = () => {
  return (
    <Box className="missingContainer">
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Missing
        </Typography>
      </Box>

      <Box className="imageSection">
        <img src={img404} alt="" className="image" />
      </Box>
    </Box>
  );
};

export default Missing;
