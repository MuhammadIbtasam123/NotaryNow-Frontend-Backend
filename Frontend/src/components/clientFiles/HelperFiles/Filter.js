import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import './HelperStyle.css';

const Filter = () => {
  return (
    <Box>
      <form className="filter-form" action="">
        <input
          type="text"
          placeholder='Search...'
          className="filter-input"
        />
        <Button className="filter-button">
          Search
        </Button>
      </form>
    </Box>
  );
};

export default Filter;
