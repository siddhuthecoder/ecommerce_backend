import express from "express";
import {
  fetchSessions,
  fetchUserFromToken,
  loginUser,
  logoutUser,
  registerUser,
} from "../Controllers/User.js";
import authenticate from "../Middleware/authentication.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", authenticate, logoutUser);
userRouter.get("/sessions", authenticate, fetchSessions);
userRouter.get("/user", authenticate, fetchUserFromToken);

export default userRouter;
