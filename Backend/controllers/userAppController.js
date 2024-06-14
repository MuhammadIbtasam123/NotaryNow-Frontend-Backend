import User from "../model/user.model.js";
import Notary from "../model/notary.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTP } from "./userMailer.js";
import generateToken from "../helperFunctions/helper.js";
import { sendRedirectLink } from "./userResetMailer.js";
import Document from "../model/Document.model.js";
import NotaryAvailability from "../model/notaryAvailability.model.js";
import Appointment from "../model/Appointment.model.js";
import DayTimes from "../model/dayTime.model.js";
import Days from "../model/Days.model.js";
import TimeSlots from "../model/TimeSlots.model.js";
import Meeting from "../model/Meeting.model.js";
import path from "path";
import fs from "fs/promises"; // Use fs.promises to read the file
import { fileURLToPath } from "url";
import sequelize from "../database/config.js";
import Notaries from "../model/notary.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne(
      {
        where: {
          username,
        },
      },
      {
        raw: true,
      }
    );
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}
export async function signup(req, res) {
  console.log(req.body);
  const { username, name, email, password, cnic, frontImage, backImage } =
    req.body;

  try {
    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ where: { cnic } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      name,
      email,
      password: await bcrypt.hash(password, 10),
      cnic,
      cnicFront: frontImage,
      cnicBack: backImage,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(200).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error(`An error occurred while signing up user: ${error.message}`);
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`Validation error: ${err.message}`);
      });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
export async function login(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Find the user by their email
    const user = await User.findOne({
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
        res.status(200).json({ message: "Login Successful", token });
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
/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  // console.log(req.headers.authorization);

  // verify the token from the user and extract info from it

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { username } = decoded;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    // Find the user by username
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      console.log("User not found with username: ", username);
      return res.status(404).send({ error: "User not found" });
    }

    // console.log("User found: ", user.toJSON());

    /** remove password from user */
    // PostgreSQL return unnecessary data with object so convert it into json
    const { password, ...rest } = user.toJSON();

    return res.status(200).send(rest);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function updateUser(req, res) {
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
    const [rowsUpdated, [updatedUser]] = await User.update(
      {
        address: body.address,
        profileImage: body.selectedImage,
        contact: body.contact,
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
export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({
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
export const resetPassword = async (req, res) => {
  console.log(req.body);
  console.log(req.params);

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
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "Email not registered!" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  await User.update(
    { password: hashedPassword },
    {
      where: { email },
    }
  );

  res.status(200).send("Password reset successfully");
};
// handle get document of users
export const getDocuments = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  try {
    // fetch all documents of user from database
    const documents = await Document.findAll({
      where: {
        UserId: decoded.cnic,
      },
    });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
// handle upload document
export const uploadDocuments = async (req, res) => {
  try {
    // extract cnic from token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    // Extract user ID and other metadata from the request body

    // Extract the PDF file from the request
    const pdfFile = req.file;
    // console.log(pdfFile);

    // Check if the PDF file exists
    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const buffer = await fs.readFile(pdfFile.path);
    console.log("Buffer: ", buffer);

    // Store the PDF file in the database
    const document = await Document.create({
      UserId: cnic, // Assuming userId is provided in the request body
      documentFile: pdfFile.path,
      documentName: pdfFile.originalname,
      documentdata: buffer,
    });

    console.log(document.toJSON());

    // Return a success response
    return res
      .status(201)
      .json({ message: "PDF file uploaded successfully.", document });
  } catch (error) {
    console.error("Error uploading PDF file:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
// handle delete document
export const deleteDocument = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;

  try {
    // Extract the document ID from the request params
    const { id } = req.params;
    // Find the document by ID
    const document = await Document.findByPk(id);
    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }
    // Delete the document from the database
    await document.destroy();

    // get all documents of user from database
    const documents = await Document.findAll({
      where: {
        UserId: cnic,
      },
    });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    console.log(req.params);
    // Extract the document ID from the request params
    const { id } = req.params;
    // Fetch the document from the database based on docid
    const document = await Document.findByPk(id);

    if (!document) {
      return res
        .status(404)
        .json({ error: `Document not found for the given docid ${id}` });
    }

    // Check if the document is currently being edited
    if (document.synchoronizeFlag) {
      return res.status(403).json({
        message: "Document is currently open in edit mode by someone else.",
      });
    }

    // Send the document data as a response
    res.setHeader("Content-Type", "application/pdf"); // Set the response content type
    res.send(document.documentdata); // Send the document data
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// handle get notaries
export const getNotaries = async (req, res) => {
  try {
    // Fetch all notaries from the database
    const notaries = await Notary.findAll();
    // console.log(notaries);

    // filter out data from notaries to show to the user
    const filteredNotaries = notaries.map((notary) => {
      const { cnic, notary_name, address, profileImage } = notary;
      // console.log(id);
      return {
        cnic,
        image: profileImage,
        notaryName: notary_name,
        address,
        totalDocNotarized: 30,
        amount: "Rs. 200",
      };
    });

    return res.status(200).json({ notaries: filteredNotaries });
  } catch (error) {
    console.error("Error fetching notaries:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const getSpecificNotary = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the data corresponding to that notary.
    const notary = await Notary.findOne({
      where: {
        cnic: id,
      },
    });

    // find the time slots of the notary against each day on which noary is available and then create an object like.

    const NotaryAvailabilityIds = await NotaryAvailability.findAll({
      where: {
        notaryId: id,
      },
    });

    // console.log(NotaryAvailabilityIds.map((item) => item.dayTimeId));

    //find day Id and time slots id against each daytime id
    const dayTimeIds = NotaryAvailabilityIds.map((item) => item.dayTimeId);

    const dayTimeData = await DayTimes.findAll({
      where: {
        id: dayTimeIds,
      },
    });

    // console.log(dayTimeData.map((item) => item.toJSON()));

    const dayTimeDataArray = dayTimeData.map((item) => item.toJSON());

    // group the time slots against each dayid and then create an object like day and time slots

    const dayTimeDataGrouped = dayTimeDataArray.reduce((acc, item) => {
      if (!acc[item.day_id]) {
        acc[item.day_id] = [];
      }
      acc[item.day_id].push(item.time_slot_id);
      return acc;
    }, {});

    // console.log(dayTimeDataGrouped);

    // now we have to find the day name and time slots name against each day id and time slot id from database and then create an object

    const dayTimeDataGroupedArray = await Promise.all(
      Object.entries(dayTimeDataGrouped).map(async ([dayId, timeSlotIds]) => {
        const day = await Days.findOne({
          where: {
            id: dayId,
          },
        });

        const timeSlots = await TimeSlots.findAll({
          where: {
            id: timeSlotIds,
          },
        });

        return {
          day: day.day,
          timeSlots: timeSlots.map((item) => item.start_time),
        };
      })
    );

    // figure out that appointment is not already booked.
    // notary ki availability id hai or ma na ya dekhna hai ka kisi user ki us date pa booking to nhi hai takkay ma data bhej sakun frontend pa to select other slot.

    const checkNotaryIsAlreadyBooked = await Appointment.findAll({
      where: {
        notaryAvailabilityId: NotaryAvailabilityIds.map((item) => item.id),
      },
    });

    let BookedDate = [];
    // console.log(checkNotaryIsAlreadyBooked[1].dataValues);
    if (checkNotaryIsAlreadyBooked) {
      // Assuming checkNotaryIsAlreadyBooked is an array of objects containing booked slots
      BookedDate = checkNotaryIsAlreadyBooked.map((bookedSlot) => ({
        date: bookedSlot.dataValues.date,
        timeSlot: [bookedSlot.dataValues.timeSlot], // Convert single time slot to array
      }));
    }
    if (notary) {
      // filter out data from notaries to show to the user
      const { cnic, notary_name, address, profileImage } = notary;

      const notaryObj = {
        data: {
          cnic,
          image: profileImage,
          notaryName: notary_name,
          address,
          totalDocNotarized: 30,
          amount: "Rs. 200",
        },
        dayTimeDataGroupedArray,
        BookedDate,
      };

      // console.log(notaryObj);
      const notaryArray = [notaryObj];
      // If notary data is found, send it in the response
      res.status(200).json(notaryArray);
    } else {
      // If notary data is not found, send a 404 error
      res.status(404).json({ error: "Notary not found" });
    }
  } catch (error) {
    // If an error occurs, send a 500 error
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// handle create appointment
export const createAppointment = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    console.log(req.body);
    console.log(cnic);
    // Extract day, date, and timeSlot from the request body
    const { day, date, timeSlot, NID, documentId } = req.body;

    console.log(day, date, timeSlot, NID, documentId);

    // Find the Day ID based on the day
    const dayId = await Days.findOne({
      where: {
        day,
      },
    });

    const DAYID = dayId.dataValues.id;

    // Find the TimeSlot ID based on the timeslot
    const TimeSlotId = await TimeSlots.findOne({
      where: {
        start_time: timeSlot,
      },
    });

    const TIMESLOTID = TimeSlotId.dataValues.id;

    // Find the DayTime ID based on the day and time slot
    const dayTime = await DayTimes.findOne({
      where: {
        day_id: DAYID,
        time_slot_id: TIMESLOTID,
      },
    });

    if (!dayTime) {
      return res.status(404).json({ message: "DayTime not found" });
    }

    // Find the NotaryAvailability ID based on the DayTime ID
    const notaryAvailability = await NotaryAvailability.findOne({
      where: {
        dayTimeId: dayTime.dataValues.id,
        notaryId: NID,
      },
    });

    console.log(notaryAvailability.dataValues.id);

    // console.log(notaryAvailability.dataValues.id);

    if (!notaryAvailability) {
      return res.status(404).json({ message: "NotaryAvailability not found" });
    }

    // Create an appointment with the found NotaryAvailability ID, date, user ID (CNIC), and status set to false
    const appointment = await Appointment.create({
      notaryAvailabilityId: notaryAvailability.dataValues.id,
      userId: cnic,
      date,
      timeSlot: timeSlot,
      docId: documentId,
      status: false,
    });

    return res
      .status(201)
      .json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ message: "Failed to create appointment" });
  }
};

export const unpaidAppointments = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    console.log(cnic);

    // Find all unpaid appointments for the user
    const unpaidAppointments = await Appointment.findAll({
      where: {
        userId: cnic,
        clinetPaymentStatus: false,
      },
    });

    // Extract the notary availability IDs
    const notaryAvailabilityIds = unpaidAppointments.map(
      (appointment) => appointment.notaryAvailabilityId
    );

    // console.log(notaryAvailabilityIds);

    // Fetch the notaries based on the availability IDs
    const notaries = await NotaryAvailability.findAll({
      where: {
        id: notaryAvailabilityIds,
      },
      order: [
        [
          sequelize.literal(
            `CASE "id" ${notaryAvailabilityIds
              .map((value, index) => `WHEN ${value} THEN ${index}`)
              .join(" ")} ELSE ${notaryAvailabilityIds.length} END`
          ),
          "ASC",
        ],
      ],
    });

    // console.log(notaries.map((item) => item.notaryId));

    // fetch the notary data based on the unique notary ids
    const notaryData = await Promise.all(
      notaries.map(async (item) => {
        const notaryId = item.notaryId;
        const data = await Notary.findAll({
          where: {
            cnic: notaryId,
          },
        });
        return data;
      })
    );

    const notaryDataArray = notaryData.map((item) => item[0].dataValues);

    const AppointmentDataWithNotary = await Appointment.findAll({
      where: {
        userId: cnic,
      },
    });

    const AppointmentData = AppointmentDataWithNotary.map((appointment) => {
      const { date, timeSlot } = appointment.dataValues;
      return {
        date,
        timeSlot,
      };
    });

    // console.log(AppointmentData);
    // now we have to create a notary array of object having notary data and appointment data

    const notaryArray = notaryDataArray.map((notary, idx) => {
      const { notary_name, profileImage } = notary;

      const notaryObj = {
        image: profileImage,
        notaryName: notary_name,
        amount: "Rs. 200",
      };

      return {
        notaryObj,
        AppointmentData: AppointmentData[idx],
        notaryAvailabilityIds: notaryAvailabilityIds[idx],
      };
    });
    // console.log(notaryArray);

    return res.status(200).json(notaryArray);
  } catch (error) {
    console.error("Error fetching unpaid appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadReceipts = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    // Extract notary availability ID and date from the request body
    const { notaryAvaialableId, dateToSend } = req.body;
    console.log(notaryAvaialableId, dateToSend);

    // Get the uploaded file from the request
    const receipt = req.file;

    console.log(receipt);

    if (!receipt) {
      return res.status(400).json({ message: "Receipt file is required." });
    }

    // Update the database with the receipt file path
    const filePath = receipt.path;
    const AppointmentReceipt = await Appointment.update(
      {
        clinetPaymentStatus: true,
        paidReceipt: filePath,
      },
      {
        where: {
          userId: cnic,
          notaryAvailabilityId: notaryAvaialableId,
          date: dateToSend,
        },
      }
    );

    // Return a success response
    return res.status(200).json({ message: "Receipt uploaded successfully." });
  } catch (error) {
    console.error("Error uploading receipt:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const upcomingAppointments = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    console.log(cnic);

    // Find all upcoming appointments for the user
    const upcomingAppointments = await Appointment.findAll({
      where: {
        userId: cnic,
        clinetPaymentStatus: true,
        notaryConfirmationStatus: true, // cahnge to true
      },
    });

    // console.log(upcomingAppointments.map((item) => item.dataValues));

    // Extract the notary availability IDs
    const notaryAvailabilityIds = upcomingAppointments.map(
      (appointment) => appointment.notaryAvailabilityId
    );

    // console.log(notaryAvailabilityIds);

    // Fetch the notaries based on the availability IDs
    const notaries = await NotaryAvailability.findAll({
      where: {
        id: notaryAvailabilityIds,
      },
      order: [
        [
          sequelize.literal(
            `CASE "id" ${notaryAvailabilityIds
              .map((value, index) => `WHEN ${value} THEN ${index}`)
              .join(" ")} ELSE ${notaryAvailabilityIds.length} END`
          ),
          "ASC",
        ],
      ],
    });

    // console.log(notaries.map((item) => item));

    // fetch the notary data based on the unique notary ids
    const notaryData = await Promise.all(
      notaries.map(async (item) => {
        const notaryId = item.notaryId;
        const data = await Notary.findAll({
          where: {
            cnic: notaryId,
          },
        });
        return data;
      })
    );

    // console.log(notaryData.map((item) => item[0].dataValues));

    const notaryDataArray = notaryData.map((item) => item[0].dataValues);

    // console.log(notaryDataArray);

    const AppointmentData = upcomingAppointments.map((appointment) => {
      const { date, timeSlot } = appointment.dataValues;
      return {
        date,
        timeSlot,
      };
    });

    // now we have to create a notary array of object having notary data and appointment data
    const notaryArray = notaryDataArray.map((notary, idx) => {
      const { notary_name, profileImage } = notary;

      const notaryObj = {
        image: profileImage,
        notaryName: notary_name,
        amount: "Rs. 200",
      };

      return {
        notaryObj,
        AppointmentData: AppointmentData[idx],
        AppointmentId: upcomingAppointments[idx].dataValues.appointmentId,
        notaryAvailabilityIds: notaryAvailabilityIds[idx],
      };
    });
    // console.log(notaryArray);

    return res.status(200).json(notaryArray);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unconfirmedAppointment = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;

    console.log(cnic);

    // Find all upcoming appointments for the user
    const upcomingAppointments = await Appointment.findAll({
      where: {
        userId: cnic,
        clinetPaymentStatus: true,
        notaryConfirmationStatus: false, // cahnge to true
      },
    });

    // console.log(upcomingAppointments.map((item) => item.dataValues));

    // Extract the notary availability IDs
    const notaryAvailabilityIds = upcomingAppointments.map(
      (appointment) => appointment.notaryAvailabilityId
    );

    // console.log(notaryAvailabilityIds);

    // Fetch the notaries based on the availability IDs
    const notaries = await NotaryAvailability.findAll({
      where: {
        id: notaryAvailabilityIds,
      },
      order: [
        [
          sequelize.literal(
            `CASE "id" ${notaryAvailabilityIds
              .map((value, index) => `WHEN ${value} THEN ${index}`)
              .join(" ")} ELSE ${notaryAvailabilityIds.length} END`
          ),
          "ASC",
        ],
      ],
    });

    // console.log(notaries.map((item) => item));

    // fetch the notary data based on the unique notary ids
    const notaryData = await Promise.all(
      notaries.map(async (item) => {
        const notaryId = item.notaryId;
        const data = await Notary.findAll({
          where: {
            cnic: notaryId,
          },
        });
        return data;
      })
    );

    // console.log(notaryData.map((item) => item[0].dataValues));

    const notaryDataArray = notaryData.map((item) => item[0].dataValues);

    // console.log(notaryDataArray);

    const AppointmentData = upcomingAppointments.map((appointment) => {
      const { date, timeSlot } = appointment.dataValues;
      return {
        date,
        timeSlot,
      };
    });

    // now we have to create a notary array of object having notary data and appointment data
    const notaryArray = notaryDataArray.map((notary, idx) => {
      const { notary_name, profileImage } = notary;

      const notaryObj = {
        image: profileImage,
        notaryName: notary_name,
        amount: "Rs. 200",
      };

      return {
        notaryObj,
        AppointmentData: AppointmentData[idx],
        notaryAvailabilityIds: notaryAvailabilityIds[idx],
      };
    });
    console.log(notaryArray);

    return res.status(200).json(notaryArray);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDocumentsAppointment = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { cnic } = decoded;
  console.log(decoded);

  try {
    // fetch all documents of user from database
    const documents = await Document.findAll({
      where: {
        UserId: cnic,
        docStatus: false,
      },
    });

    const documentArray = documents.map((document) => {
      const { documentId, documentName, documentFile } = document;
      return {
        documentId,
        documentName,
        documentFile,
      };
    });

    return res.status(200).json(documentArray);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const UserAppointmentDetails = async (req, res) => {
  try {
    // Extract user CNIC from the decoded JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cnic } = decoded;
    const { id } = req.params;

    // console.log(cnic, id);

    //fetching the appointment details using id

    const appointment = await Appointment.findOne({
      where: {
        appointmentId: id,
        clinetPaymentStatus: true,
        notaryConfirmationStatus: true,
      },
    });

    // console.log(appointment);

    // now i had to fetch the notary data from availabilities table

    const notaryId = await NotaryAvailability.findOne({
      where: {
        id: appointment.dataValues.notaryAvailabilityId,
      },
    });

    // console.log(notaryId.dataValues);

    const notary = await Notaries.findOne({
      where: {
        cnic: notaryId.dataValues.notaryId,
      },
    });

    // console.log(notary.dataValues);

    const user = await User.findOne({
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

    // getting the meeting data from meeting table

    const meeting = await Meeting.findOne({
      where: {
        appId: id,
      },
    });

    console.log(meeting.dataValues);

    // creating the object to send back to the frontend

    const data = {
      user: {
        name: notary.dataValues.name,
        profileImage: notary.dataValues.profileImage,
        Cid: cnic, //user id needed to send back to the frontend
        CName: user.dataValues.name, // needed for user signature
      },
      document: {
        DocName: document.dataValues.documentName,
        DocFile: document.dataValues.documentFile,
        DocId: document.dataValues.documentId,
        // DocUpdatedFilePath: document.dataValues.documentFileUpdated,
      },
      time: {
        time: appointment.dataValues.timeSlot,
        date: appointment.dataValues.date,
      },
      meetingData: {
        name: notary.dataValues.name,
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
