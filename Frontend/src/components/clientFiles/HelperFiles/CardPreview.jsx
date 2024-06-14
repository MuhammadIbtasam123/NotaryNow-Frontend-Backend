import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PDFViewer from "./PDFViewer";
import { useState } from "react";
import { Link } from "react-router-dom";
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

  const handleSessionStart = () => {
    // console.log("Start session", userPaymentInformation);
    // console.log("Start session", userPaymentInformation[0].meetingId);
    // console.log("Start session", userPaymentInformation[0].meetingUserName);
    // Start the session
    const url = `https://notarization-session.netlify.app/?room=${
      userPaymentInformation[0].meetingId
    }&name=${encodeURIComponent(userPaymentInformation[0].meetingUserName)}`;

    // redirect to the URL
    window && window.open(url, "_blank");
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
      {userPaymentInformation && userPaymentInformation[0] && (
        <>
          <Link
            to={`/User/eSignDoc/${userPaymentInformation[0].docId}+${userPaymentInformation[0].Cname}`}
          >
            <Button
              style={{
                backgroundColor: "#0D3343",
                color: "white",
                marginTop: "10px",
              }}
            >
              Add E-Sign/Stamp - Document
            </Button>
          </Link>
          {/* <Button
            style={{
              backgroundColor: "#0D3343",
              color: "white",
              marginTop: "10px",
            }}
            // onClick={handleSeeUpdatedDocument}
          >
            View Updated Document
          </Button> */}
          <Button
            style={{
              backgroundColor: "#0D3343",
              color: "white",
              marginTop: "10px",
            }}
            onClick={handleSessionStart}
          >
            Start Session
          </Button>
        </>
      )}
    </>
  );
};

export default CardPreview;
