import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  logoutTime: Date,
  ipAddress: {
    type: String,
    required: true,
  },
});

const Sessions = mongoose.model("Sessions", sessionSchema);
export default Sessions;
