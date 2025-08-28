import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import {PreApprovedUser} from "../models/preApprovedUser.model.js"


const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24*60*60*1000,
    };

    res.status(200)
    .cookie("Token",token,options)
    .json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

const uploadPreApprovedUsers = async (req, res) => {
  const { role } = req.body;
  const filePath = req.file?.path;

  if (!filePath || !role || !["student", "teacher"].includes(role)) {
    return res.status(400).json({ message: "File and valid role (student or teacher) required." });
  }

  try {
    const users = [];

    if (filePath.endsWith(".csv")) {
      // Read CSV
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.name && row.email) {
            users.push({ name: row.name.trim(), email: row.email.trim().toLowerCase(), role });
          }
        })
        .on("end", async () => {
          const result = await PreApprovedUser.insertMany(users, { ordered: false });
          fs.unlinkSync(filePath);
          res.status(200).json({ message: "Users uploaded successfully", count: users.length });
        });
    } else if (filePath.endsWith(".xlsx")) {
      // Read Excel
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      data.forEach((row) => {
        if (row.name && row.email) {
          users.push({ name: row.name.trim(), email: row.email.trim().toLowerCase(), role });
        }
      });

      await PreApprovedUser.insertMany(users, { ordered: false });
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Users uploaded successfully", count: users.length });
    } else {
      return res.status(400).json({ message: "Only CSV or Excel files are supported." });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to process file." });
  }
};

const getPreApprovedUsers = async (req, res) => {
  try {
    const users = await PreApprovedUser.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      message: "Fetched pre-approved users successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Failed to fetch pre-approved users:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export {loginAdmin,uploadPreApprovedUsers,getPreApprovedUsers}