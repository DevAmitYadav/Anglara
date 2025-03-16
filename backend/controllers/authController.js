import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import moment from "moment";

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * @desc Register User
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("🔹 Incoming Register Request:", req.body);

    const { firstName, lastName, email, phone, dob, gender, password, confirmPassword, role, address } = req.body;

    // 🔹 Validate Required Fields
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // 🔹 Validate Password
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters, contain an uppercase letter, and a number.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    // 🔹 Validate & Format Date of Birth
    const parsedDOB = moment(dob, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
    if (!parsedDOB.isValid()) {
      return res.status(400).json({ success: false, message: "Invalid DOB format. Use: DD-MM-YYYY or YYYY-MM-DD" });
    }
    const formattedDOB = parsedDOB.format("YYYY-MM-DD");

    // 🔹 Check if User Already Exists
    if (await User.exists({ email })) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // 🔹 Create User (Mongoose pre-save will hash password)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob: formattedDOB,
      gender,
      password, // No need to hash manually, Mongoose pre-save hook will handle it
      role: role || "Customer",
      address,
    });

    console.log("✅ User Registered:", user.email);

    // 🔹 Send Response with Token
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    next(error);
  }
});

/**
 * @desc Login User
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("🔹 Incoming Login Request:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // 🔹 Find User & Select Password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User Not Found:", email);
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // 🔹 Compare Passwords
    const isMatch = await user.matchPassword(password);
    console.log(`🔑 Password Match: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    console.log("✅ User Logged In:", user.email);

    // 🔹 Set Token as HTTP-only Cookie
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 🔹 Send Response
    res.json({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
        address : user.address
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    next(error);
  }
});
