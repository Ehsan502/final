import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getLevelForPoints } from "../utils/gamification.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
    });

    res.status(201).json({
      user: { ...user.toSafeObject(), level: getLevelForPoints(user.points) },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked. Contact support." });
      }
      res.json({
        user: { ...user.toSafeObject(), level: getLevelForPoints(user.points) },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ ...user.toSafeObject(), level: getLevelForPoints(user.points) });
  } catch (error) {
    next(error);
  }
};
