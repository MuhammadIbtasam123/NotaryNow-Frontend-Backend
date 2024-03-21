import { Box } from '@mui/material';
import logoImg from '../../assets/images/notrarize.svg';
import facebookIcon from '../../assets/images/facebook.png';
import gmailIcon from '../../assets/images/gmail.png';
import InstagaramIcon from '../../assets/images/instagram.png';
import linkedinIcon from '../../assets/images/linkedin.png';
import React from 'react';
import './homeStyles.css';

const Footer = () => {
    //creating a date object to get current date
    const date = new Date();
    const year = date.getFullYear();

  return (
    <Box className="footer-container">
      <Box className="logo-container">
        <img src={logoImg} alt="Notrarize Logo" className="logo-image"/>
      </Box>

      <Box className="rights-container">
        <p className="rights-text">© {year} All Rights Reserved</p>
      </Box>

      <Box className="social-container">
      <p className="connect-text">Stay Connected</p>
        <Box className="social-comtainer-alignment">
          <img src={linkedinIcon} alt="Linkedin" className="social-icon"/>
          <img src={facebookIcon} alt="Facebook" className="social-icon"/>
          <img src={InstagaramIcon} alt="Instagram" className="social-icon"/>
          <img src={gmailIcon} alt="Gmail" className="social-icon"/>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
