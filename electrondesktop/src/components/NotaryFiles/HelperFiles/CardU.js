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

// import * as React from "react";
// import { Box } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import ibtasamImg from "../../../assets/images/ibtasam-fyp.jpg";
// import "./HelperStyle.css";

// const CardU = ({ notariesPaymentInformation }) => {
//   const [selectedOptions, setSelectedOptions] = React.useState([]);

//   const handleOptionChange = (option) => {
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((item) => item !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   return (
//     <>
//       {notariesPaymentInformation.map((notary, index) => (
//         <Card key={notary.id} className="cardContainer">
//           <CardMedia
//             component="img"
//             className="cardMedia"
//             image={ibtasamImg}
//             alt="Live from space album cover"
//           />
//           <CardContent className="cardContent">
//             <Typography
//               variant="h6"
//               className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
//             >
//               Name: {notary.userName}
//             </Typography>
//             <Typography
//               variant="subtitle2"
//               className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
//             >
//               Date: {notary.date}
//             </Typography>
//             <Typography
//               variant="subtitle2"
//               className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
//             >
//               Time: {notary.time}
//             </Typography>
//           </CardContent>

//           <Box className="general-flex">
//             <input
//               type="checkbox"
//               checked={selectedOptions.includes(notary.id)}
//               onChange={() => handleOptionChange(notary.id)}
//             />
//             <Typography
//               variant="subtitle1"
//               className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
//               component="div"
//             >
//               Confirm
//             </Typography>
//           </Box>
//         </Card>
//       ))}
//     </>
//   );
// };

// export default CardU;
