import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import './mainFiles.css'

const documents = [
  {
    id: 1,
    documentName: 'Rental_Lease.pdf',
    notary: 'A.Nawaz Osmani Law Associates'
  },
  {
    id: 2,
    documentName: 'Land_Lord_CNIC.pdf',
    notary: '24 Justice Pk'
  },
  {
    id: 3,
    documentName: 'Power_of_Attorney.pdf',
    notary: 'Hamdard Law Associates'
  },
  {
    id: 4,
    documentName: 'Result_Card.pdf',
    notary: 'Ahmad Law Services'
  },
  {
    id: 5,
    documentName: 'Domicile.pdf',
    notary: 'A.Nawaz Osmani Law Associates'
  }
]

const NoatrizedDocuments = () => {
  return (
    <Box>
      <Box className='headerSection'>
        <Typography variant='h5' className='documentTitle'>
          Notarized Documents
        </Typography>
      </Box>

      <Box>
        {documents.map((document) => (
          <Box key={document.id} className='documentBox'>
            <Button className='documentButton'>
              <Typography>{document.documentName}</Typography>
              <Typography>{document.notary}</Typography>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default NoatrizedDocuments;
