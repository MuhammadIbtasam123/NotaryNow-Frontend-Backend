import React from 'react';
import { Box } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';
import './HelperStyle.css';

const PersonalInforamtionAttributes = ['Name', 'Conatct', 'Email', 'Address', 'CNIC', 'UserName'];
const PersonalInformationData = ['Ibtasam', '0333-1234567', 'ibtasam@gmail.com', 'Lahore', '35202-8368021-7', 'ibtasam123'];

const InformationBox = () => {
  return (
    <Box className="information-box">
      <Typography className="information-header">Personal Information</Typography>

      <Grid container className="information-grid">
        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInforamtionAttributes.map((element, index) => index % 2 === 0 && (
              <Typography className="information-attribute" key={index}>
                {element}<strong>:</strong>
              </Typography>
            ))}
          </Grid>

          <Grid xs={6}>
            {PersonalInformationData.map((element, index) => index % 2 === 0 && (
              <Typography className="information-value" key={index}>
                {element}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInforamtionAttributes.map((element, index) => index % 2 !== 0 && (
              <Typography className="information-attribute" key={index}>
                {element}<strong>:</strong>
              </Typography>
            ))}
          </Grid>

          <Grid xs={6}>
            {PersonalInformationData.map((element, index) => index % 2 !== 0 && (
              <Typography className="information-value" key={index}>
                {element}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InformationBox;
