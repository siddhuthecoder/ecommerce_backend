import User from "../Models/User.js";
import supabase from "../supabaseClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Session from "../Models/Sessions.js";

export const registerUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  try {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: "This username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (error) {
      return res
        .status(400)
        .json({ message: "Error signing up with Supabase" });
    }

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
    });

    return res
      .status(201)
      .json({ message: "Registration successful! You may log in now." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, ip } = req.body;

  try {
    // const { user, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    // if (error) {
    //   console.log(error.message);
    //   return res.status(400).json({ message: "Error signing in" });
    // }

    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: dbUser._id, role: dbUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // create new session
    const ipAddress = req.ip || ip;
    await Session.findOneAndUpdate(
      {
        userId: dbUser._id,
        ipAddress,
        logoutTime: null,
      },
      {
        loginTime: Date.now(),
        logoutTime: null,
      },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Login successful", token, user: dbUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { userId: req.user._id, logoutTime: null },
      { logoutTime: Date.now() },
      { new: true }
    );

    if (!session) {
      return res.status(400).json({ message: "No active session found" });
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchSessions = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }

  try {
    const sessions = await Session.find();
    if (!sessions)
      return res.status(404).json({ message: "Session not found" });

    return res.status(200).json({ sessions: sessions });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchUserFromToken = async (req, res) => {
  return res.json({ user: req.user });
};
