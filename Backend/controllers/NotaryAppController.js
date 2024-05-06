import Notary from "../model/notary.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTP } from "./userMailer.js";
import generateToken from "../helperFunctions/helper.js";
import { sendRedirectLink } from "./resetMailerNotary.js";
import NotaryAvailability from "../model/NotaryAvailability.model.js"; // Import the NotaryAvailability model
import DayTimes from "../model/DayTime.model.js"; // Import the DayTime model
import Days from "../model/Days.model.js"; // Import the Days model
import TimeSlots from "../model/TimeSlots.model.js";
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
  console.log(req.body);
  const { name, username, email, password, cnic } = req.body;
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
    const newNotary = new Notary({
      name,
      username,
      email,
      password: await bcrypt.hash(password, 10),
      cnic,
    });

    // Save the notary to the database
    const savedNotary = await newNotary.save();

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
    const user = await Notary.findOne({
      where: {
        cnic,
      },
    });
    // console.log(user.dataValues);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // PostgreSQL return unnecessary data with object so convert it into json
    const { password, ...rest } = user.toJSON();
    // console.log(rest);

    return res.status(200).send(rest);
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
