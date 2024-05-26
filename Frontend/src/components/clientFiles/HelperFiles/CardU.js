import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./HelperStyle.css";
const CardU = ({ notariesPaymentInformation }) => {
  const [selectedFile, setSelectedFile] = React.useState({});
  const [selectedNotary, setSelectedNotary] = React.useState(null);

  const handleFileChange = async (event, notaryId) => {
    const base64 = event.target.files[0];
    setSelectedFile({
      ...selectedFile,
      [notaryId]: base64,
    });
    setSelectedNotary(notaryId);
  };
  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const uploadReceipt = async (notaryId, date) => {
    try {
      const formData = new FormData();
      formData.append("receipt", selectedFile[notaryId]);
      formData.append("dateToSend", date);
      formData.append("notaryAvaialableId", notaryId);

      const response = await axios.post(
        "http://localhost:8080/api/uploadPaymentReceipt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Receipt uploaded successfully:", response.data);

      if (
        response.status === 200 ||
        response.data.success ||
        response.data.ok ||
        response.data.code === 200
      ) {
        // Show a success toast message
        showToast("Receipt uploaded successfully", "success");
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      // Show an error toast message
      showToast("Error uploading receipt", "error");
    }
  };
  return (
    <>
      {notariesPaymentInformation.length === 0 && (
        <Typography variant="h6" className="noAppointments">
          No Appointments
        </Typography>
      )}
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

          <div className="fileInputContainer">
            <label
              htmlFor={`fileInput-${index}`}
              className="customUploadButton"
            >
              <input
                type="file"
                accept="image/*"
                id={`fileInput-${index}`}
                style={{ display: "none" }} // Hide the file input
                onChange={(e) => handleFileChange(e, notary.id)}
                className="customFileInput"
              />
              Recipt
            </label>
            <Button
              className="customUploadButton"
              onClick={() => uploadReceipt(notary.id, notary.date)}
            >
              Upload
            </Button>
          </div>
          <ToastContainer />
        </Card>
      ))}
    </>
  );
};

export default CardU;
