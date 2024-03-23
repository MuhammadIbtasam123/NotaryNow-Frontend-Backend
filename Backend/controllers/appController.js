import User from "../model/User.model.js";

export async function signup(req, res) {
  const { username, name, email, password, cnic } = req.body;

  try {
    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
      where: {
        username: username,
        email: email,
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
      password,
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
