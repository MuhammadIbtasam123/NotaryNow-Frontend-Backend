import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PDFViewer from "./PDFViewer";
import { useState } from "react";
import "./HelperStyle.css";

const CardPreview = ({ userPaymentInformation }) => {
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <>
      {userPaymentInformation.map((user, index) => (
        <Card key={index} className="cardContainer">
          <CardMedia
            component="img"
            className="cardMedia"
            image={user.image}
            alt="Live from space album cover"
          />
          <CardContent className="cardContent">
            <Typography
              variant="h6"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Name: {user.userName}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Date: {user.date}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Time: {user.time}
            </Typography>
          </CardContent>
          {open && (
            <PDFViewer
              docFile={user.docFile}
              docName={user.docName}
              handleClose={handleClose}
              handleOpen={handleOpen}
              open={open}
            />
          )}
        </Card>
      ))}
      <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
        onClick={handleOpen}
      >
        View Document
      </Button>
      <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
      >
        Start Session
      </Button>
    </>
  );
};

export default CardPreview;