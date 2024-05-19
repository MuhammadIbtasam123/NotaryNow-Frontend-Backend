import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
import Days from "./model/Days.model.js";
import TimeSlots from "./model/TimeSlots.model.js";
import DayTimes from "./model/dayTime.model.js";
import NotaryAvailability from "./model/notaryAvailability.model.js";
import Appointment from "./model/Appointment.model.js";
const app = express();

/** middlewares */
app.use(
  express.json({
    limit: "30mb",
    extended: true,
  })
);

app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our

const port = 8080;

// If the database table doesn't exist, Sequelize will create it

Days.sync();
TimeSlots.sync();
DayTimes.sync();
NotaryAvailability.sync();
Appointment.sync();

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

/** api routes */
app.use("/api", router);

// server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
