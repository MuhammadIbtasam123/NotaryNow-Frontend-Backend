import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./HelperStyle.css";

const CardUNC = ({ notariesPaymentInformation }) => {
  return (
    <>
      {notariesPaymentInformation.map((notary, index) => (
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
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Name: {notariesPaymentInformation[index].notaryName}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Date: {notariesPaymentInformation[index].date}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Time: {notariesPaymentInformation[index].time}
            </Typography>
          </CardContent>

          <Typography
            variant="subtitle1"
            className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            component="div"
          >
            {notary.amount}
          </Typography>
        </Card>
      ))}
    </>
  );
};

export default CardUNC;
