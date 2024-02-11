import React from 'react';
import { Box, Typography } from '@mui/material';
import InformationBox from '../HelperFiles/InformationBox';
import profilePic from '../../../assets/images/ibtasam-fyp.jpg';
import './mainFiles.css'; 

const Profile = () => {
  return (
    <Box className="profileContainer"> 
      <Typography variant="h6" className="profileTitle"> 
        Profile
      </Typography>
      <img src={profilePic} alt="" className="profileImage" /> 
      <InformationBox />
    </Box>
  );
};

export default Profile;
