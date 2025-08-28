import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Admin email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Admin password is required"],
    minlength: 6,
  },
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed one
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
