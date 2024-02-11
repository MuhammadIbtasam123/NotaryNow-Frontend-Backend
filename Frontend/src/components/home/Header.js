import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import bgimg from '../../assets/images/noatry-paper.png';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import './homeStyles.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Stack direction='row' spacing={14} className="header-container">
      <Box className="text-section">
        <Box className="text-section-display">
          <Typography variant="h2" gutterBottom className='utility-section'>
            Notarize Online. Anywhere. Anytime.
          </Typography>

          <Typography variant="body1" gutterBottom className='utility-section'>
            "Skip the trip to find a notary. Notarize your document online with ease – upload, verify, and connect with a notary in minutes."
          </Typography>

          <Box className='button-section'>
            <Typography variant="button" display="block" gutterBottom>
              <Link to='/LoginClient'>
                <Button className="notarize-button">Get Document Notarized</Button>              
              </Link>
            </Typography>

            <Typography variant="button" display="block" gutterBottom>
            <Link to='/LoginNotary'>
              <Button variant="outlined" className="notary-button">Continue as Notary</Button>   
            </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box>
        <img src={bgimg} alt="notary-paper" className="bg-image" />
      </Box>
    </Stack>
  );
};
export default Header;


