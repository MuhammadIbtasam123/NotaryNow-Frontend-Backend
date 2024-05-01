import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
// import {
//   populateDays,
//   populateTimeSlots,
//   populateDayTime,
// } from "./populateDB/db.functions.js";

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

// // Populate Days table
// populateDays()
//   .then(() => populateTimeSlots())
//   .then(() => populateDayTime())
//   .catch((error) => console.error("Error:", error));

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
