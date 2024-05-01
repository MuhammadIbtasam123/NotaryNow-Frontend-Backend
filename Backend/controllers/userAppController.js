import User from "../model/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTP } from "./userMailer.js";
import generateToken from "../helperFunctions/helper.js";
import { sendRedirectLink } from "./userResetMailer.js";
import Document from "../model/Document.model.js";
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
      cnicFront: frontImage,
      cnicBack: backImage,
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
    console.log(pdfFile);

    // Check if the PDF file exists
    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    // Store the PDF file in the database
    const document = await Document.create({
      UserId: cnic, // Assuming userId is provided in the request body
      documentFile: pdfFile.path,
      documentName: pdfFile.originalname,
    });

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
