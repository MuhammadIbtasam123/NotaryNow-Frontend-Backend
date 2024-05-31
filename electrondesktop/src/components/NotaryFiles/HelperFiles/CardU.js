import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./HelperStyle.css";

const CardUNC = ({ userPaymentInformation }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

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

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/confirmAppointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Handle success, e.g., show a success message
      if (
        response.data.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        showToast("Appointment confirmed successfully", "success");
      }
      console.log("Appointment confirmed:", response.data);
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error confirming appointment:", error);
    }
  };

  const handleViewAppointment = (appointmentId, paidReceipt) => {
    setSelectedAppointment(appointmentId);
    setPaidReceipt(paidReceipt);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
    setPaidReceipt(null);
    setOpenDialog(false);
  };

  return (
    <>
      {userPaymentInformation.map((appointment, index) => (
        <Card key={appointment.id} className="cardContainer">
          <CardMedia
            component="img"
            className="cardMedia"
            image={appointment.image}
            alt="Appointment Image"
          />

          <CardContent className="cardContent">
            <Typography
              variant="h6"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Name: {appointment.userName}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Date: {appointment.date}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Time: {appointment.time}
            </Typography>
          </CardContent>

          <Button
            onClick={() => handleConfirmAppointment(appointment.id)}
            variant="contained"
            color="primary"
            style={{ fontSize: "0.8rem", width: "50%" }}
          >
            Confirm Appointment
          </Button>

          <Button
            onClick={() =>
              handleViewAppointment(appointment.id, appointment.paidReceipt)
            }
            variant="outlined"
            color="primary"
            style={{
              fontSize: "0.75rem",
              width: "40%",
              color: "black",
              borderColor: "black",
            }}
          >
            View Appointment
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>View Appointment</DialogTitle>
            <DialogContent>
              {paidReceipt ? (
                <img
                  src={paidReceipt}
                  alt="Paid Receipt"
                  style={{ width: "100%" }}
                />
              ) : (
                <Typography>No receipt available</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <ToastContainer />
        </Card>
      ))}
    </>
  );
};

export default CardUNC;
