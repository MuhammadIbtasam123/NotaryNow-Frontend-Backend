import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./HelperStyle.css";
import { useState } from "react";
import axios from "axios";

const CardUp = ({ notariesPaymentInformation }) => {
  return (
    <>
      {notariesPaymentInformation.map((notary, index) => (
        <Link to={`/User/preview/${notariesPaymentInformation[index].appId}`}>
          <Card
            key={notariesPaymentInformation[index].id}
            className="cardContainer"
          >
            <CardMedia
              component="img"
              className="cardMedia"
              image={notariesPaymentInformation[index].image}
              alt="Live from space album cover"
            />

            <CardContent className="cardContent">
              <Typography
                variant="h6"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Name: {notariesPaymentInformation[index].notaryName}
              </Typography>
              <Typography
                variant="subtitle2"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Date: {notariesPaymentInformation[index].date}
              </Typography>
              <Typography
                variant="subtitle2"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Time: {notariesPaymentInformation[index].time}
              </Typography>
            </CardContent>

            <Typography
              variant="subtitle1"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              component="div"
            >
              {notary.amount}
            </Typography>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default CardUp;
