import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import InformationBox from "../HelperFiles/InformationBox";
import userImg from "../../../assets/images/ibtasam-fyp.jpg";
import "./mainFiles.css";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(userImg);

  return (
    <Box className="profileContainer">
      <Typography variant="h6" className="profileTitle">
        Profile
      </Typography>
      <img src={selectedImage} alt="" className="profileImage" />
      <InformationBox
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </Box>
  );
};

export default Profile;
