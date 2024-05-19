// SelectTime.jsx

import React from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import BoxDateTime from "./BoxDateTime";
import "./HelperStyle.css";

// const Time = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

const SelectTime = ({ dayTime }) => {
  return (
    <>
      <Typography variant="h5" className="selectTimeTitle">
        Select Time
      </Typography>

      <Box className="selectTimeContainer">
        <BoxDateTime dayTime={dayTime} />
      </Box>
    </>
  );
};

export default SelectTime;
