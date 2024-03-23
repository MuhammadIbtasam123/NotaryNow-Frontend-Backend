import User from "../model/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";

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
  const { username, name, email, password, cnic } = req.body;

  try {
    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
      where: {
        cnic,
      },
    });
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
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(200).json({
      message: "User signed up successfully",
    }); // Return the saved user object
  } catch (error) {
    console.error(`An error occurred while signing up user: ${error.message}`);
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
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
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
  const { username } = req.params;
  console.log(username);

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

    console.log(user);

    /** remove password from user */
    // PostgreSQL return unnecessary data with object so convert it into json
    const { password, ...rest } = user.toJSON();

    return res.status(201).send(rest);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    console.log(req.user);
    const { cnic } = req.user;

    if (!cnic) {
      return res.status(401).send({ error: "User Not Found" });
    }

    const body = req.body; // Assuming body contains fields to be updated

    // Update the user data in the database
    const [rowsUpdated, [updatedUser]] = await User.update(body, {
      where: { cnic },
      returning: true,
    });

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
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}
