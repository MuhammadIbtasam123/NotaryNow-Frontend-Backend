import { Box } from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import EmailIcon from '../../assets/images/email.png';
import PhoneIcon from '../../assets/images/contact.png';
import './homeStyles.css';

const ConatctUs = () => {
  const ContactUs = [{
    id: 1,
    discription: 'Our team would love to help you find the perfect fit of products and solutions.',
    phoneNo: '+92 333 1234567',
    email: 'notaryNow@gmail.com'
  }];

  return (
    <Box className="contact-container">
      <Typography gutterBottom variant="h3" component="div" className="contact-heading">
        Contact Us
      </Typography>

      {ContactUs.map((item) => (
        <Box key={item.id}>
          <Typography gutterBottom variant="h5" component="div" className="contact-description">
            {item.discription}
          </Typography>

          <Box className="contact-info">
            <div className="icon-container">
              <img className="phone-icon" src={PhoneIcon} alt="Phone Icon" />
              <img className="email-icon" src={EmailIcon} alt="Email Icon" />
            </div>

            <div className="text-info">
              <Typography variant="body1" color="text.secondary" className="phone-number">
                {item.phoneNo}
              </Typography>

              <Typography variant="body1" color="text.secondary" className="email-address">
                {item.email}
              </Typography>
            </div>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ConatctUs;
