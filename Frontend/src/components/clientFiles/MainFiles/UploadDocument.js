import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './mainFiles.css';

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
  },
  {
    id: 6,
    documentName: '',
    notary: 'Pakistan Law Associates'
  }
]

const UploadDocument = () => {
  return (
    <Box>
      <Box className="container"> 
        <Typography
          variant='h5'
          className="uploadTitle" 
        >
          Upload Document
        </Typography>
        <Button className="uploadFileButton">Upload File</Button> 
      </Box>

      <Box className="documentListContainer"> 
        <Typography className="documentHeaders">Document Name</Typography> 
        <Typography className="documentHeaders">Linked Appointment</Typography> 
      </Box>

      <Box>
        {documents.map((document) => (
          <Box key={document.id} className="documentItem"> 
            {!document.documentName ?
              (
                <Button className="addButton">+</Button> 
              ) :
              (
                <Typography>{document.documentName}</Typography>
              )
            }

            <Typography>{document.notary}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadDocument;
