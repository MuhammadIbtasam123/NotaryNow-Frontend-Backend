// import Days from "../model/Days.model.js"; // Import the Days model
// import TimeSlots from "../model/TimeSlots.model.js"; // Import the TimeSlots model
// import DayTime from "../model/DayTime.model.js"; // Import the DayTime model

// // Function to populate the Days table
// const populateDays = async () => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   try {
//     for (const day of days) {
//       await Days.create({ day });
//     }
//     console.log("Days table populated successfully.");
//   } catch (error) {
//     console.error("Error populating Days table:", error);
//   }
// };

// // Function to populate the TimeSlots table
// const populateTimeSlots = async () => {
//   try {
//     const startTime = new Date();
//     startTime.setHours(9, 0, 0); // Set start time to 09:00:00
//     const endTime = new Date();
//     endTime.setHours(17, 0, 0); // Set end time to 17:00:00

//     const timeSlots = [];
//     const interval = 30; // Interval in minutes
//     let currentTime = new Date(startTime);

//     while (currentTime <= endTime) {
//       const startTimeString = currentTime.toLocaleTimeString("en-US", {
//         hour12: false,
//       });
//       currentTime.setMinutes(currentTime.getMinutes() + interval);
//       const endTimeString = currentTime.toLocaleTimeString("en-US", {
//         hour12: false,
//       });

//       timeSlots.push({ start_time: startTimeString, end_time: endTimeString });
//     }

//     await TimeSlots.bulkCreate(timeSlots);
//     console.log("TimeSlots table populated successfully.");
//   } catch (error) {
//     console.error("Error populating TimeSlots table:", error);
//   }
// };

// // Function to populate the DayTime table
// const populateDayTime = async () => {
//   try {
//     const days = await Days.findAll();
//     const timeSlots = await TimeSlots.findAll();

//     const dayTimeData = [];
//     days.forEach((day) => {
//       timeSlots.forEach((timeSlot) => {
//         dayTimeData.push({ day_id: day.id, time_slot_id: timeSlot.id });
//       });
//     });

//     await DayTime.bulkCreate(dayTimeData);
//     console.log("DayTime table populated successfully.");
//   } catch (error) {
//     console.error("Error populating DayTime table:", error);
//   }
// };

// export { populateDays, populateTimeSlots, populateDayTime };
