import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./HelperStyle.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentDropdown from "./SelectDocument";
const DateTime = ({ dayTime, BookedSlots, NID }) => {
  const [activeDay, setActiveDay] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [activeTimeSlot, setActiveTimeSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [date, setDate] = useState("");

  //states for documents
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  // Function to handle booking appointment
  const bookAppointment = async () => {
    if (activeDay) {
      try {
        // Send the selected data to the backend to store in the appointment table
        const response = await axios.post(
          "http://localhost:8080/api/createAppointment",
          {
            NID: NID,
            day: activeDay,
            date: date,
            timeSlot: timeSlots[activeTimeSlot].originalTime,
            documentId: selectedDocumentId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          // Clear selected data after booking
          setActiveDay(null);
          setActiveTimeSlot(null);
          setActiveDate(null);
          setDate("");
          // Show a success toast message
          toast("Appointment created successfully!", "success");
        } else {
          alert("Failed to book appointment. Please try again later.");
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Failed to book appointment. Please try again later.");
      }
    } else {
      alert("Please select a day, date, and time slot before booking.");
    }
  };

  const initializeAvailableDays = () => {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 (Sunday) - 6 (Saturday)
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Find the available days based on the data from the backend
    const availableDaysFromData = dayTime.map((dayData) => dayData.day);

    // Find the next available working day
    let nextAvailableDayIndex = (currentDayIndex + 1) % 7;
    while (
      daysOfWeek[nextAvailableDayIndex] === "Saturday" ||
      daysOfWeek[nextAvailableDayIndex] === "Sunday"
    ) {
      nextAvailableDayIndex = (nextAvailableDayIndex + 1) % 7;
    }

    // Set the active day and available days
    const startFromDay = daysOfWeek[0];
    const startIndex = availableDaysFromData.indexOf(startFromDay);
    const sortedAvailableDays = availableDaysFromData
      .slice(startIndex)
      .concat(availableDaysFromData.slice(0, startIndex));

    const activeDay = sortedAvailableDays[0];
    setActiveDay(activeDay);
    setAvailableDays(sortedAvailableDays);

    // Initialize time slots for the active day
    const activeDayData = dayTime.find((day) => day.day === activeDay);
    if (activeDayData) {
      const convertedTimeSlots = activeDayData.timeSlots.map((time) => {
        const timeObj = new Date(`2000-01-01T${time}`);
        return {
          time: timeObj.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          originalTime: time,
        };
      });
      setTimeSlots(convertedTimeSlots);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/getDocumentsAppointment",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Documents:", response.data);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents", error);
      }
    };

    fetchDocuments();
    initializeAvailableDays();
  }, [dayTime]);

  useEffect(() => {
    if (dayTime && activeDay) {
      const activeDayData = dayTime.find((day) => day.day === activeDay);
      if (activeDayData) {
        const convertedTimeSlots = activeDayData.timeSlots.map((time) => {
          const timeObj = new Date(`2000-01-01T${time}`);
          return {
            time: timeObj.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            originalTime: time,
          };
        });
        setTimeSlots(convertedTimeSlots);
      }
    }
  }, [dayTime, activeDay, BookedSlots]);

  const handleTimeSlotClick = (index) => {
    setActiveTimeSlot(index);
  };

  const isTimeSlotBooked = (date, timeSlot) => {
    const currentDate = new Date(date);

    return BookedSlots.some((bookedSlot) => {
      const bookedDate = new Date(bookedSlot.date);

      // Check if the timeSlot is an array
      if (Array.isArray(bookedSlot.timeSlot)) {
        // If it's an array, check if the current date matches, and the current time slot is present in the array
        return (
          bookedDate.toDateString() === currentDate.toDateString() &&
          bookedSlot.timeSlot.some(
            (bookedTime) => bookedTime === timeSlot.originalTime
          )
        );
      } else {
        // If it's not an array, use the existing logic
        const bookedTime = bookedSlot.timeSlot;
        return (
          bookedDate.toDateString() === currentDate.toDateString() &&
          bookedTime === timeSlot.originalTime
        );
      }
    });
  };
  if (!dayTime) {
    return <div>Loading...</div>; // Render a loading indicator until dayTime is available
  }

  return (
    <>
      <Typography variant="h5" className="selectDateTitle">
        Select Date
      </Typography>

      {/* Render days */}
      <Box className="selectDateContainer">
        {availableDays.slice(0, 5).map((day, index) => {
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const today = new Date();
          const currentDayIndex = today.getDay();
          const dayOfWeekIndex = daysOfWeek.indexOf(day);
          const dayDiff = (dayOfWeekIndex + 7 - currentDayIndex) % 7;
          const dayDate = new Date(
            today.getTime() + dayDiff * 24 * 60 * 60 * 1000
          );
          const formattedDate = dayDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Box
              key={index}
              className={`box-style ${day === activeDay ? "active" : ""}`}
              onClick={() => {
                setActiveDay(day);
                setDate(formattedDate);
              }}
            >
              {day}
              <br />
              {formattedDate}
            </Box>
          );
        })}
      </Box>

      <Typography variant="h5" className="selectTimeTitle">
        Select Time
      </Typography>

      {/* Render time slots for the active day in a grid layout */}
      <Box className="selectTimeGridContainer">
        {timeSlots.map((time, index) => (
          <Box
            key={index}
            className={`box-style ${index === activeTimeSlot ? "active" : ""} ${
              isTimeSlotBooked(date, time) ? "booked" : ""
            }`}
            onClick={() => handleTimeSlotClick(index)}
          >
            {time.time}
          </Box>
        ))}
      </Box>

      {/* dropdown menu to selct documents */}
      <DocumentDropdown
        documents={documents}
        selectedDocumentId={selectedDocumentId}
        setSelectedDocumentId={setSelectedDocumentId}
      />

      <Button className="bookButton" onClick={bookAppointment}>
        Book Appointment
      </Button>
      <ToastContainer />
    </>
  );
};

export default DateTime;
