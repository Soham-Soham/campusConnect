import mongoose from "mongoose";
import { type } from "os";

const preApprovedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  isRegistered:{
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

const PreApprovedUser = mongoose.model("PreApprovedUser", preApprovedUserSchema);
export { PreApprovedUser };
