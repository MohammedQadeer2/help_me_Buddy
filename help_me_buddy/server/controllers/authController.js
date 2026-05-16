// 🔑 Generate Token
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// Generate Token helper function
// ==========================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
};

// This keeps password out of API responses


// ==========================================
// Register / Sign Up
// ==========================================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    // Hash the password securely so it can't be read in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user and save to database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: ["user"],
      isProvider: false,
    });

    // Generate a token for the session
    const token = await generateToken(newUser._id);

    // Give the user a secure cookie with the token that lasts 7 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send back the new user data
    // Send only safe user data
    return res.status(201).json(sanitizeUser(newUser));

  } catch (error) {
    // If anything fails, send a 500 error
    return res.status(500).json({ message: `Sign up error ${error.message}` });
  }
};


// ==========================================
// Login
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look for the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not exists!!" });
    }

    // Check if the provided password matches the saved database password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect!!" });
    }

    // Generate a token for the session
    if (!user.roles || user.roles.length === 0) {
      user.roles = ["user"];
      user.isProvider = Boolean(user.isProvider);
      await user.save();
    }

    const token = await generateToken(user._id);

    // Give the user a secure cookie with the token that lasts 7 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send back the logged in user data
    // Send only safe user data
    return res.status(200).json(sanitizeUser(user));

  } catch (error) {
    // If anything fails, send a 500 error
    return res.status(500).json({ message: `Login error ${error.message}` });
  }
};
