import Notary from "../model/notary.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTP } from "./userMailer.js";
import generateToken from "../helperFunctions/helper.js";
import { sendRedirectLink } from "./resetMailerNotary.js";
import User from "../model/user.model.js";
import NotaryAvailability from "../model/notaryAvailability.model.js";
import DayTimes from "../model/dayTime.model.js";
import Days from "../model/Days.model.js";
import TimeSlots from "../model/TimeSlots.model.js";
import Appointment from "../model/Appointment.model.js";
import Document from "../model/Document.model.js";
import Stamp from "../model/Stamp.model.js";
import Meeting from "../model/Meeting.model.js";
import generateStamp from "../helperFunctions/generateStamp.js";
// import sequelize from "../database/config.js";
import { RoomIdGenerator } from "../helperFunctions/generateRoomId.js";
import { Op } from "sequelize";

/** middleware for verify Notary */
export async function verifyNotary(req, res, next) {
  try {
    const { notaryname } = req.method == "GET" ? req.query : req.body;

    // check the user existancecs
    let exist = await NotaryModel.findOne(
      {
        where: {
          notaryname,
        },
      },
      {
        raw: true,
      }
    );
    if (!exist) return res.status(404).send({ error: "Can't find Notary!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

// NOTARY SIGNUP CONTROLLER

export async function signupNotary(req, res) {
  const { name, username, email, password, cnic, contact, licenseNumber } =
    req.body;
  try {
    // Check if the notary or email already exists in the database
    const existingNotary = await Notary.findOne({
      where: {
        cnic,
      },
    });
    if (existingNotary) {
      return res
        .status(400)
        .json({ message: "Notary or email already exists" });
    }

    // Create a new notary instance
    const hashedPassword = await bcrypt.hash(password, 10);
    const newNotary = await Notary.create({
      name,
      notary_name: username,
      email,
      password: hashedPassword,
      cnic,
      contact,
      license: licenseNumber,
    });

    console.log("start generating stamp buffer...");
    //Generate stamp image buffer (assuming you have a function named generateStamp)
    const stampImageBuffer = await generateStamp(
      name,
      cnic,
      licenseNumber,
      contact
    );

    // Create a new stamp record in the database
    const newStamp = await Stamp.create({
      stampImage: stampImageBuffer,
      notaryId: cnic, // Associate the stamp with the created notary public
    });

    console.log("stamp created...");

    res.status(200).json({
      message: "Notary signed up successfully",
    }); // Return the saved user object
  } catch (error) {
    console.error(
      `An error occurred while signing up Notary: ${error.message}`
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// NOTARY LOGIN CONTROLLER

export async function notarylogin(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Find the user by their email
    const user = await Notary.findOne({
      where: {
        email: email,
      },
    });

    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the password
    bcrypt.compare(password, user.dataValues.password, function (err, result) {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      if (result) {
        // Generate JWT token
        const token = jwt.sign(
          {
            cnic: user.dataValues.cnic,
            username: user.dataValues.username,
            email: user.dataValues.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        // Send the token and a success message to the frontend
        res.status(200).json({ message: "Notary Login Successful", token });
      } else {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    });
  } catch (error) {
    console.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNotary(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;

  // console.log(token);
  // console.log(decoded);
  // console.log(req.body);
  try {
    if (!cnic) {
      return res.status(401).send({ error: "User Not Found" });
    }
    const body = req.body; // Assuming body contains fields to be updated
    // Update the user data in the database
    const [rowsUpdated, [updatedUser]] = await Notary.update(
      {
        address: body.address,
        profileImage: body.selectedImage,
        contact: body.contact,
        username: body.username,
        Notification_No: body.Notification_No,
        Seal_Issue: body.Seal_Issue,
        Expiry_date: body.Expiry_date,
      },
      {
        where: { cnic },
        returning: true,
      }
    );
    // Check if the user was updated successfully
    if (rowsUpdated === 1) {
      return res.status(200).send({
        message: "User record updated successfully",
        user: updatedUser.toJSON(),
      });
    } else {
      return res
        .status(404)
        .send({ error: "User not found or data not updated" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  const { email } = req.body;
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // if there is req from frontend then send the otp to the user
  if (req) {
    await sendOTP(email, req.app.locals.OTP);
  }
}
/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  // getting back the otp from the user
  const { otp } = req.body;
  // comapring the otp with the generated otp
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    req.app.locals.OTP = null; // reset the OTP value
    return res.status(200).send({ msg: "OTP Verify Successsfully!" });
  } else {
    return res.status(400).send({ error: "Invalid OTP" });
  }
}

/** PUT: http://localhost:8080/api/forgotPassword */
export async function notrayforgotPassword(req, res) {
  console.log("inside notary forgot password");
  // console.log(req)
  const { email } = req.body;

  try {
    // Find the user by their email
    const user = await Notary.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: " Email not registered!" });
    }

    // gnerate new token and send redirect link to the user
    const token = generateToken();

    // storing into loclal memory
    req.app.locals.ResetToken = token;
    req.app.locals.email = email;

    await sendRedirectLink(email, token);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(`Error updating password: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Endpoint to handle password reset
export const notaryresetPassword = async (req, res) => {
  // console.log("inside notary reset password");
  // console.log("req body ", req.body);
  // console.log("req params ",req.params);

  // Parsing the token from URL params
  const { token } = req.params;
  const { newPassword } = req.body;
  const email = req.app.locals.email;

  console.log(token, req.app.locals.ResetToken);

  // Check if the token is valid
  if (token !== req.app.locals.ResetToken) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  //  we have to update the password in the database
  const user = await Notary.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "Email not registered!" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  await Notary.update(
    { password: hashedPassword },
    {
      where: { email },
    }
  );

  res.status(200).send("Password reset successfully");
};

/** GET: http://localhost:8080/api/user/example123 */
export async function getNotary(req, res) {
  // verify the token from the user and extract info from it
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // extract the cnic from the token
  const { cnic } = decoded;

  try {
    // Find the user by cnic
    const notary = await Notary.findOne({
      where: {
        cnic,
      },
    });
    // console.log(user.dataValues);
    if (!notary) {
      return res.status(404).send({ error: "Notary not found" });
    }

    //getting the stamp of notary against cnic

    const stamp = await Stamp.findOne({
      where: {
        notaryId: cnic,
      },
    });

    // PostgreSQL return unnecessary data with object so convert it into json
    const { password, ...notaryData } = notary.toJSON();
    const rest = {
      ...notaryData,
      stampImage: stamp ? stamp.stampImage : null,
    };

    return res.status(200).setHeader("Content-Type", "image/jpeg").send(rest);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

/* Availability form of Notary */

export async function Availability(req, res) {
  // Assuming you can extract the notary ID from the token
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;
  console.log(req.body);
  const dataFromFrontend = req.body; // Assuming the data is sent in the request body
  try {
    const days = dataFromFrontend.map(async (day) => {
      // find the id of day from Days table
      const dayDataId = await Days.findOne({
        where: {
          day: day.day,
        },
      });
      const dayId = dayDataId.dataValues.id;
      // console.log(dayDataId.dataValues.id);

      // need to fetch the ids of timeslots agaisnt each dayID from timeslots table
      // want to get ids in between the start time and end time where we have seprate columns for start and end time
      const timeSlots = await TimeSlots.findAll({
        where: {
          [Op.and]: [
            { start_time: { [Op.gte]: day.startTime } },
            { start_time: { [Op.lte]: day.endTime } },
          ],
        },
      });
      // sort the timeslots in ascending order
      // console.log(timeSlots.map((slot) => slot.dataValues.id));

      // console.log("These are days ids:");
      // console.log(dayDataId.dataValues.id);
      // console.log("These are timeslots ids against each day id:");
      const timeSlotIds = timeSlots.map((slot) => slot.dataValues.id);
      // console.log(timeSlotIds.sort((a, b) => a - b));

      // now i have to retrieve the ids of daytimes against each day id and timeslot id
      const dayTimes = await DayTimes.findAll({
        where: {
          day_id: dayId,
          time_slot_id: timeSlotIds,
        },
      });
      //console.log(dayTimes.map((dayTime) => dayTime.dataValues.id));
      console.log(
        "These are daytimes ids against each day id and timeslot id:"
      );

      const dayTimeIds = dayTimes.map((dayTime) => dayTime.dataValues.id);

      // now i have to insert the data into NotaryAvailability table against each dayTime id
      await Promise.all(
        dayTimeIds.map(async (dayTimeId) => {
          const newAvailability = new NotaryAvailability({
            notaryId: cnic,
            dayTimeId: dayTimeId,
          });
          return await newAvailability.save();
        })
      );
    });

    // Send a success response
    res
      .status(200)
      .send({ message: "Notary availability updated successfully" });
  } catch (error) {
    console.error("Error updating notary availability:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

// Endpoint to get the availability of a notary

export const getAvailability = async (req, res) => {
  // Assuming you can extract the notary ID from the token
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;

  try {
    // first getting the notary id and dateTime id from NotaryAvailability table on basis of notary cnic.
    const notaryAvailability = await NotaryAvailability.findAll({
      where: {
        notaryId: cnic,
      },
    });

    // sort by dayTimeId and only see notaryId and dayTimeId
    const sortedAvailability = notaryAvailability.map((availability) => ({
      notaryId: availability.dataValues.notaryId,
      dayTimeId: availability.dataValues.dayTimeId,
    }));

    // now we have day time id - want to fetch day id  using dayTimeId from db
    // dayTimeSlots is an array of objects containing dayTimeId and dayId
    const DayTimeSlots = await DayTimes.findAll({
      where: {
        id: sortedAvailability.map((availability) => availability.dayTimeId),
      },
    });

    // WANT TO GET ONLY DAY ID AND DAY TIME ID
    const dayTimeSlots = DayTimeSlots.map((dayTimeSlot) => ({
      dayId: dayTimeSlot.dataValues.day_id,
      timeSlotId: dayTimeSlot.dataValues.time_slot_id,
    }));
    console.log(dayTimeSlots);

    // now we have day id - want to fetch day name using dayId from db
    const days = await Days.findAll({
      where: {
        id: dayTimeSlots.map((dayTimeSlot) => dayTimeSlot.dayId),
      },
    });

    console.log(days.map((day) => day.dataValues.day));

    //  loop over array
    //  for all those object where day id is same, get the first and the last time slot id against that day id.
    // do this for all objects in the array

    const dayTimeSlotsWithDay = await Promise.all(
      days.map(async (day) => {
        const dayId = day.dataValues.id;
        const dayName = day.dataValues.day;
        const timeSlots = dayTimeSlots
          .filter((dayTimeSlot) => dayTimeSlot.dayId === dayId)
          .map((dayTimeSlot) => dayTimeSlot.timeSlotId);
        const startTime = await TimeSlots.findOne({
          where: { id: Math.min(...timeSlots) },
        });
        const endTime = await TimeSlots.findOne({
          where: { id: Math.max(...timeSlots) },
        });
        return {
          day: dayName,
          startTime: startTime.start_time,
          endTime: endTime.start_time,
        };
      })
    );

    // do a bit modification of end time if it is greater than 12 and add AM/PM format 10:00 AM | 10:00 PM
    dayTimeSlotsWithDay.forEach((day) => {
      const startTime = day.startTime.split(":");
      const endTime = day.endTime.split(":");
      if (parseInt(startTime[0]) > 12) {
        startTime[0] = (parseInt(startTime[0]) - 12).toString();
        day.startTime = `${startTime.join(":")} PM`;
      } else {
        day.startTime = `${startTime.join(":")} AM`;
      }
      if (parseInt(endTime[0]) > 12) {
        endTime[0] = (parseInt(endTime[0]) - 12).toString();
        day.endTime = `${endTime.join(":")} PM`;
      } else {
        day.endTime = `${endTime.join(":")} AM`;
      }
    });

    // console.log(dayTimeSlotsWithDay);
    return res.status(200).send(dayTimeSlotsWithDay);
  } catch (error) {
    console.error("Error retrieving notary availability:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Endpoint to edit the availability of a notary

export const editAvailability = async (req, res) => {
  // Assuming you can extract the notary ID from the token
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;

  try {
    const data = req.body; // Assuming the data is sent in the request body
    console.log(data);

    if (!data) {
      return res.status(400).send({ error: "No data received" });
    }

    const resultToEdit = data.filter((object) => {
      return object.available === true;
    });

    console.log(resultToEdit);

    // seprate the day and time from the resultToEdit array
    const day = resultToEdit.map((day) => day.day);
    const startTime = resultToEdit.map((day) => day.startTime);
    const endTime = resultToEdit.map((day) => day.endTime);

    console.log(day, startTime, endTime);

    // get the day id from the Days table
    const dayId = await Days.findOne({
      where: {
        day: day,
      },
    });

    console.log(dayId.dataValues.id);

    // embed :00 at end of start time and end time
    const startTimeEmbed = `${startTime}:00`;
    const endTimeEmbed = `${endTime}:00`;

    // get the time slot ids as array from the TimeSlots table from start time and end time
    const timeSlots = await TimeSlots.findAll({
      where: {
        [Op.and]: [
          { start_time: { [Op.gte]: startTimeEmbed } },
          { start_time: { [Op.lte]: endTimeEmbed } },
        ],
      },
    });

    console.log(timeSlots.map((slot) => slot.dataValues.id));

    // now we have to get daytime id from DayTimes table against each day id and time slot id
    const dayTimes = await DayTimes.findAll({
      where: {
        day_id: dayId.dataValues.id,
        time_slot_id: timeSlots.map((slot) => slot.dataValues.id),
      },
    });

    const daytimeEq1 = dayTimes.map((dayTime) => dayTime.dataValues.id); // equation 1

    // fetch all the timeslots ids from timeSlots table
    const allTimeSlots = await TimeSlots.findAll();
    const allTimeSlotsArray = allTimeSlots.map((slot) => slot.dataValues.id);

    //fetch all the daytimes ids from DayTimes table using dayid and all timeslots ids
    const allDayTimes = await DayTimes.findAll({
      where: {
        day_id: dayId.dataValues.id,
        time_slot_id: allTimeSlotsArray,
      },
    });

    const daytimeEq2 = allDayTimes.map((dayTime) => dayTime.dataValues.id); // equation 2
    console.log(daytimeEq1);
    console.log(daytimeEq2);
    // remove all the data from NotaryAvailability table against those day time ids and notary ids
    await NotaryAvailability.destroy({
      where: {
        notaryId: cnic,
        dayTimeId: daytimeEq2,
      },
    });

    // insert the data into NotaryAvailability table against each dayTime id
    const updatedData = await Promise.all(
      daytimeEq1.map(async (dayTimeId) => {
        const newAvailability = new NotaryAvailability({
          notaryId: cnic,
          dayTimeId: dayTimeId,
        });
        return await newAvailability.save();
      })
    );

    // Send a success response
    res
      .status(200)
      .send({ message: "Notary availability updated successfully" });
  } catch (error) {
    console.error("Error updating notary availability:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

export const unconfirmedAppointment = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    // console.log(cnic);

    const notaries = await NotaryAvailability.findAll({
      where: {
        notaryId: cnic,
      },
    });

    // console.log(notaries.map((notary) => notary.dataValues.id));

    const upcomingAppointments = [];

    for (const notary of notaries) {
      const appointments = await Appointment.findAll({
        where: {
          notaryAvailabilityId: notary.dataValues.id,
          clinetPaymentStatus: true,
          notaryConfirmationStatus: false,
        },
      });

      upcomingAppointments.push(...appointments);
    }

    const uniqueCnicList = [
      ...new Set(upcomingAppointments.map((item) => item.dataValues.userId)),
    ];

    const uniqueUserData = await User.findAll({
      where: {
        cnic: uniqueCnicList,
      },
    });

    const userDataMap = uniqueUserData.reduce((acc, user) => {
      acc[user.cnic] = user;
      return acc;
    }, {});

    const userData = upcomingAppointments.map(
      (item) => userDataMap[item.dataValues.userId]
    );

    const AppointmentData = upcomingAppointments.map((appointment) => {
      const { date, timeSlot, paidReceipt } = appointment.dataValues;
      return {
        date,
        timeSlot,
        paidReceipt,
      };
    });

    const UserArray = userData.map((user, idx) => {
      const { name, profileImage } = user.dataValues;

      const userObj = {
        image: profileImage,
        userName: name,
      };

      return {
        userObj,
        AppointmentData: AppointmentData[idx],
        AppointmentIds: upcomingAppointments[idx].dataValues.appointmentId,
      };
    });
    console.log(UserArray);

    return res.status(200).json(UserArray);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmAppointment = async (req, res) => {
  // console.log(appointmentId);

  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findOne({
      where: {
        appointmentId,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Appointment.update(
      { notaryConfirmationStatus: true },
      {
        where: {
          appointmentId,
        },
      }
    );

    // Create a new meeting instance

    const getRommId = await RoomIdGenerator();

    // console.log(getRommId);

    //check if the meeting already exists
    const meeting = await Meeting.findOne({
      where: {
        appId: appointmentId,
      },
    });

    if (meeting) {
      return res.status(200).json({ message: "Appointment confirmed" });
    }

    // if not create a new meeting

    const newMeeting = new Meeting({
      roomId: getRommId,
      appId: appointmentId,
    });

    // Save the meeting to the database
    await newMeeting.save();

    return res.status(200).json({ message: "Appointment confirmed" });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const notaryConfirmedAppointment = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    const notaries = await NotaryAvailability.findAll({
      where: {
        notaryId: cnic,
      },
    });

    const upcomingAppointments = [];

    for (const notary of notaries) {
      const appointments = await Appointment.findAll({
        where: {
          notaryAvailabilityId: notary.dataValues.id,
          clinetPaymentStatus: true,
          notaryConfirmationStatus: true,
        },
      });

      upcomingAppointments.push(...appointments);
    }

    const uniqueCnicList = [
      ...new Set(upcomingAppointments.map((item) => item.dataValues.userId)),
    ];

    const uniqueUserData = await User.findAll({
      where: {
        cnic: uniqueCnicList,
      },
    });

    const userDataMap = uniqueUserData.reduce((acc, user) => {
      acc[user.cnic] = user;
      return acc;
    }, {});

    const userData = upcomingAppointments.map(
      (item) => userDataMap[item.dataValues.userId]
    );

    const AppointmentData = upcomingAppointments.map((appointment) => {
      const { date, timeSlot, paidReceipt } = appointment.dataValues;
      return {
        date,
        timeSlot,
      };
    });

    const UserArray = userData.map((user, idx) => {
      const { name, profileImage } = user.dataValues;

      const userObj = {
        image: profileImage,
        userName: name,
      };

      return {
        userObj,
        AppointmentData: AppointmentData[idx],
        AppointmentIds: upcomingAppointments[idx].dataValues.appointmentId,
      };
    });
    // console.log(UserArray);

    return res.status(200).json(UserArray);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AppointmentDetails = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;
    const { id } = req.params;

    console.log(cnic, id);

    //fetching the appointment details using id

    const appointment = await Appointment.findOne({
      where: {
        appointmentId: id,
        clinetPaymentStatus: true,
        notaryConfirmationStatus: true,
      },
    });

    // console.log(appointment.dataValues);

    // now i had to fetch the user data from user table using userId that is in appointment table

    const user = await User.findOne({
      where: {
        cnic: appointment.dataValues.userId,
      },
    });

    const notary = await Notary.findOne({
      where: {
        cnic,
      },
    });

    // console.log(user.dataValues);

    // now we have to fetch the document data from document table using docId that is in appointment table

    const document = await Document.findOne({
      where: {
        documentId: appointment.dataValues.docId,
      },
    });

    // console.log(document.dataValues);

    //get the meeting data from meeting table using appointment id

    const meeting = await Meeting.findOne({
      where: {
        appId: id,
      },
    });

    console.log(meeting.dataValues);

    // creating the object to send back to the frontend

    const data = {
      user: {
        name: user.dataValues.name,
        profileImage: user.dataValues.profileImage,
        Nid: cnic, //notary id
        Nname: notary.dataValues.name,
      },
      document: {
        DocName: document.dataValues.documentName,
        DocFile: document.dataValues.documentFile,
        DocId: document.dataValues.documentId,
        DocUpdatedFilePath: document.dataValues.documentFileUpdated,
        documentSignedPath: document.dataValues.documentSignedUpdated,
      },
      time: {
        time: appointment.dataValues.timeSlot,
        date: appointment.dataValues.date,
      },
      meetingData: {
        name: user.dataValues.name,
        meetingId: meeting.dataValues.roomId,
      },
    };

    // convert to Array
    const dataArray = [data];
    console.log(dataArray);

    return res.status(200).json(dataArray);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStamp = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const stamp = await Stamp.findOne({
      where: {
        notaryId: id,
      },
    });

    if (!stamp) {
      return res.status(404).json({ message: "Stamp not found" });
    }

    // Assuming stampImage is stored as a base64 string or binary data in the database
    const stampImage = stamp.stampImage; // Adjust this line if necessary based on your model
    return res
      .status(200)
      .setHeader("Content-Type", "image/jpeg")
      .send(Buffer.from(stampImage, "base64")); // or 'binary' if stored as binary data
  } catch (error) {
    console.error("Error fetching stamp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
