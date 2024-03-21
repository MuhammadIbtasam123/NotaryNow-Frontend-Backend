import React from 'react';
import { Box } from '@mui/material';
import './homeStyles.css';

const WhyUs = () => {
  const whyUs = [
    {
      id: 1,
      title: '24/7',
      description: 'Schedule your Apppointments.',
    },
    {
      id: 2,
      title: '<1 second',
      description: 'No wait, No lines. Connect instantly.',
    },
    {
      id: 3,
      title: '10+ states',
      description: 'Documents accepted nationwide.',
    },
    {
      id: 4,
      title: '10+ thousands',
      description: 'Online notarizations completed.',
    },
  ];

  return (
    <Box className="whyus-container">
      {whyUs.map((item) => (
        <Box key={item.id} className="whyus-item">
          <h2 className="whyus-title">{item.title}</h2>
          <p className="whyus-description">{item.description}</p>
        </Box>
      ))}
    </Box>
  );
};

export default WhyUs;
