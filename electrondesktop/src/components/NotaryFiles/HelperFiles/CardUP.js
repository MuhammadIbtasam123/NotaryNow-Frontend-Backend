import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import ibtasamImg from "../../../assets/images/ibtasam-fyp.jpg";
import "./HelperStyle.css";

const CardU = ({ userPaymentInformation }) => {
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <>
      {userPaymentInformation.map((notary, index) => (
        <Link to={`/Notary/preview/${notary.id}`}>
          <Card
            key={notary.id}
            className="cardContainer"
            onClick={() => {
              console.log(notary.id);
            }}
          >
            <CardMedia
              component="img"
              className="cardMedia"
              image={ibtasamImg}
              alt="Live from space album cover"
            />
            <CardContent className="cardContent">
              <Typography
                variant="h6"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Name: {notary.userName}
              </Typography>
              <Typography
                variant="subtitle2"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Date: {notary.date}
              </Typography>
              <Typography
                variant="subtitle2"
                className={index % 2 === 0 ? "cardTextWhite" : "cardTextWhite"}
              >
                Time: {notary.time}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default CardU;
