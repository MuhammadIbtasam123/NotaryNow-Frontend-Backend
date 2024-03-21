import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import uploadDocumnet from '../../assets/images/upload-document.png';
import './homeStyles.css'

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      step: '1. Upload or scan your document',
    },
    {
      id: 2,
      step: '2. Create a Proof account',
    },
    {
      id: 3,
      step: '3. Verify your connection',
    },
    {
      id: 4,
      step: '4. Verify your identity',
    },
    {
      id: 5,
      step: '5. Connect with a notary on a video call',
    },
    {
      id: 6,
      step: '6. Access your completed document',
    },
  ];

  return (
    <Box className="how-it-works-container">
      <Typography gutterBottom variant="h3" component="div" className="section-heading">
        How It Works
      </Typography>

      <Typography gutterBottom variant="body1" component="div" className="section-description">
        Getting a document notarized is easy. Simply upload your docs, verify your identity and you will be connected to a notary via an online meeting. Notaries on the Notarize Network are always online and available 24/7.
      </Typography>
      <Box className="how-it-works-display">
        <Box className="steps-container">
            {steps.map((item) => (
            <Box key={item.id} className="step-item">
                <Typography gutterBottom variant="h5" component="div" className="step-title">
                {item.step}
                </Typography>
            </Box>
            ))}
        </Box>

        <Box className="image-container">
            <img src={uploadDocumnet} alt="Upload Document" className="upload-image" />
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorks;
