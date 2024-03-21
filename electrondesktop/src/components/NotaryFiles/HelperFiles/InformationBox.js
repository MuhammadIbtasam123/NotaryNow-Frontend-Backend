import React from "react";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import "./HelperStyle.css";
import NotaryLicense from "../../../assets/images/notary-license.webp";

const PersonalInformationAttributes = [
  "Name",
  "Contact",
  "Email",
  "Address",
  "CNIC",
  "UserName",
  "NotificationNo", // Added attribute
  "Seal-Issue", // Added attribute
  "ExpiryDate", // Added attribute
  "License", // Added attribute
];

const PersonalInformationData = [
  "Ibtasam",
  "0333-1234567",
  "ibtasam@gmail.com",
  "Lahore",
  "35202-8368021-7",
  "ibtasam123",
  "123456", // Notification No
  "ABC123", // Seal Issue
  "2024-02-29", // Expiry Date
];

const InformationBox = () => {
  return (
    <Box className="information-box">
      <Typography className="information-header">
        Personal Information
      </Typography>

      <Grid container className="information-grid">
        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInformationAttributes.map(
              (element, index) =>
                index % 2 === 0 && (
                  <Typography className="information-attribute" key={index}>
                    {element}
                    <strong>:</strong>
                  </Typography>
                )
            )}
          </Grid>
          <Grid xs={6}>
            {PersonalInformationData.map(
              (element, index) =>
                index % 2 === 0 && (
                  <Typography className="information-value" key={index}>
                    {element}
                  </Typography>
                )
            )}
          </Grid>
        </Grid>

        <Grid container xs={6} className="information-section">
          <Grid xs="auto">
            {PersonalInformationAttributes.map((element, index) => {
              if (index % 2 !== 0) {
                return (
                  <Typography className="information-attribute" key={index}>
                    {element}
                    <strong>:</strong>
                  </Typography>
                );
              }
            })}
          </Grid>
          <Grid xs={6}>
            {PersonalInformationData.map((element, index) => {
              if (index % 2 !== 0) {
                return (
                  <Typography className="information-value" key={index}>
                    {element}
                  </Typography>
                );
              } else if (index === PersonalInformationData.length - 1) {
                return (
                  <React.Fragment key={index}>
                    <img
                      src={NotaryLicense}
                      alt="Notary License"
                      className="notary-license"
                    />
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InformationBox;
