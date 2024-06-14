import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
import path from "path";
import { fileURLToPath } from "url";
import Days from "./model/Days.model.js";
import TimeSlots from "./model/TimeSlots.model.js";
import DayTimes from "./model/dayTime.model.js";
import NotaryAvailability from "./model/notaryAvailability.model.js";
import Appointment from "./model/Appointment.model.js";
import Meeting from "./model/Meeting.model.js";
import Stamp from "./model/Stamp.model.js";

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
app.disable("x-powered-by"); // less hackers know about our server

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  "/generated",
  express.static(path.join(__dirname, "controllers", "generated"))
);

console.log(__dirname);

const port = 8080;

// If the database table doesn't exist, Sequelize will create it
// Days.sync();
// TimeSlots.sync();
// DayTimes.sync();
// NotaryAvailability.sync();
// Appointment.sync();
// Meeting.sync();
Stamp.sync();

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
