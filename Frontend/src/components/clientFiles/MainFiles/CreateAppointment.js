import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardComponent from "../HelperFiles/Card";
import Filter from "../HelperFiles/Filter";
import axios from "axios";
import "./mainFiles.css";

const CreateAppointment = () => {
  const [notariesInformation, setNotariesInformation] = useState([]);
  const [filterData, setFilterData] = useState("");

  useEffect(() => {
    const fetchNoaries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/getNotaries",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data.notaries);
        setNotariesInformation(response.data.notaries);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchNoaries();
  }, []);
  return (
    <Box>
      <Box className="headerSection">
        <Typography variant="h5" className="title">
          Create Appointment
        </Typography>
        <Typography variant="h5" className="subtitle">
          Notary Officers
        </Typography>
      </Box>

      <Box className="createAppointmentContainer">
        <Filter setFilterData={setFilterData} />
        <CardComponent
          notariesInformation={notariesInformation.filter((object) => {
            if (
              object.notaryName.toLowerCase().includes(filterData.toLowerCase())
            ) {
              return object;
            }
            return null; // Add this line to return a value if the condition is not met
          })}
          setNotariesInformation={setNotariesInformation}
          filterData={filterData}
        />
      </Box>
    </Box>
  );
};

export default CreateAppointment;
