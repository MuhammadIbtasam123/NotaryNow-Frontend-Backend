import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardPreview from "../HelperFiles/CardPreview";
import "./mainFiles.css"; // Import CSS file
import axios from "axios";
import { useParams } from "react-router-dom";

const Preview = () => {
  const [userPaymentInformation, setUserPaymentInformation] = useState([
    // {
    //   id: 1,
    //   userName: "Ibtasam",
    //   date: "12/12/2021",
    //   time: "12:00 PM",
    //   image: "ibtasamImg",
    // },
  ]);
  const { id } = useParams();
  useEffect(() => {
    const getUpcomingAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/UserAppointmentDetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Upcoming appointments:", response.data);
        const userPaymentInformationResposne = await response.data.map(
          (appointment, index) => {
            return {
              Cid: appointment.user.Cid,
              Cname: appointment.user.CName,
              userName: appointment.user.name,
              date: appointment.time.date,
              time: appointment.time.time,
              image: appointment.user.profileImage,
              docId: appointment.document.DocId,
              docName: appointment.document.DocName,
              docFile: `http://localhost:8080/${appointment.document.DocFile.replaceAll(
                "\\",
                "/"
              )}`,
              meetingId: appointment.meetingData.meetingId,
              meetingUserName: appointment.meetingData.name,
            };
          }
        );

        console.log(
          "User payment information:",
          userPaymentInformationResposne
        );

        // Update the state with the fetched data
        setUserPaymentInformation(userPaymentInformationResposne);
      } catch (error) {
        console.error("Error fetching unpaid appointments:", error);
      }
    };

    getUpcomingAppointments();
  }, []);
  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="upcomingAppointmentTitle">
          Preview
        </Typography>
      </Box>

      <Box className="upcomingAppointmentsContainer">
        <CardPreview userPaymentInformation={userPaymentInformation} />
      </Box>
    </Box>
  );
};

export default Preview;
