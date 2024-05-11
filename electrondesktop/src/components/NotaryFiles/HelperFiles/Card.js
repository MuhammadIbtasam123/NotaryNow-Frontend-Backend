import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./HelperStyle.css";

const CardComponent = ({ notariesInformation }) => {
  return (
    <>
      {notariesInformation.map((notary) => (
        <Card key={notary.id} className="cardContainerSimple">
          <CardMedia
            component="img"
            className="cardMediaSimple"
            image={notary.image}
            alt="Live from space album cover"
          />

          <CardContent className="cardContentSimple">
            <Typography variant="h6" className="cardTextWhiteSimple">
              {notary.notaryName}
            </Typography>
            <Typography variant="subtitle2" className="cardTextWhiteSimple">
              {notary.address}
            </Typography>
            <Typography variant="subtitle2" className="cardTextWhiteSimple">
              {notary.totalDocNotarized}+ notarized documents
            </Typography>
          </CardContent>

          <Typography
            variant="subtitle1"
            className="cardTextWhiteSimple"
            component="div"
          >
            {notary.amount}
          </Typography>
        </Card>
      ))}
    </>
  );
};

export default CardComponent;
