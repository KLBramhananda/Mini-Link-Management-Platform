const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET_KEY } = require("../middlewares/Auth");

exports.register = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({
      error: "All fields are required",
      missingFields: {
        username: !username,
        email: !email,
        phone: !phone,
        password: !password,
      },
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    // save logging
    await newUser
      .save()
      .then((savedUser) => {
        console.log("User saved successfully:", savedUser);
      })
      .catch((saveError) => {
        console.error("Save Error:", saveError);
        throw saveError;
      });

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Full Registration Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    //  error handling
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Server error during registration",
      details: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};
