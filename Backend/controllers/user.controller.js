import { User, StudentData, TeacherData } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendRestPasswordEmail, sendSuccessResetPasswordEmail, sendVerificationEmail } from "../nodemailer/emails.js";
import { PreApprovedUser } from "../models/preApprovedUser.model.js";

const registerUser = async (req, res) => {
  //get user details from frontend
  //validate - fields are not empty
  //check if user is already exist: User collection - email
  //if not exist- check user in StudentData/TeacherData collection
  //check for image: profilePicture
  //upload image to cloudinary
  //generate verificationToken and verificationTokenExpireAt
  //send verification email
  // if email send successfully then only
  //create user object - create entry in DataBase
  //validate verificationToken and verificationToken
  //if failed - delete record from User collection
  //if successed - make isRegistered: true in StudentData/TeacherData, make verificationToken and verificationTokenExpiresAt : undefine
  //check for user creation
  //send response
  // console.log("Request: ",req);

  const { name, email, password, role, department, college, expertise } =
    req.body;

  if (!name || !email || !password || !role || !department || !college) {
    return res.status(500).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(409).json({ message: "User with email already exists" });
  }


  let userData = await PreApprovedUser.findOne({ email: email });
  // if (role == "Student") {
  //   userData = await StudentData.findOne({ email: email });
  // } else if (role == "Teacher") {
  //   userData = await TeacherData.findOne({ email: email });
  // }


  console.log(userData);

  if (!userData) {
    return res
      .status(404)
      .json({ message: " Email not recognized. You are not in the System" });
  }

  const randomNumber = Math.floor(Math.random() * 50) + 1;
  let profilePictureUrl = `https://xsgames.co/randomusers/assets/avatars/pixel/${randomNumber}.jpg`;

  // console.log("req.file: ", req.file);

  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) {
      return res
        .status(500)
        .json({ message: "Error while uploading Profile Picture" });
    }

    profilePictureUrl = uploadedImage?.url || `https://xsgames.co/randomusers/assets/avatars/pixel/${randomNumber}.jpg`;
  }
  // console.log("profilePictureUrl: ", profilePictureUrl);

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationTokenExpiresAt = Date.now() + 3600000; // Expires in 1 Hr

  const sendEmail = await sendVerificationEmail(email, verificationToken);
  if (!sendEmail) {
    return res
      .status(500)
      .json({ message: "Error while Sending verification Email" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    college,
    expertise: role === "Teacher" ? expertise : undefined,
    profilePicture: profilePictureUrl,
    verificationToken,
    verificationTokenExpiresAt,
    isVerified: false,
  });

  res
    .status(201)
    .json({
      message:
        " Registration successfull. Please check your email to verify your account",
    });
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);

    const user = await User.findOne({ verificationToken: token });
    if (!user || Date.now() > user.verificationTokenExpiresAt) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await PreApprovedUser.findOneAndUpdate({ email: user.email }, { isRegistered: true })
    // if (user.role === "Student") {
    //   await StudentData.findOneAndUpdate(
    //     { email: user.email },
    //     { isRegistered: true }
    //   );
    // } else if (user.role === "Teacher") {
    //   await TeacherData.findOneAndUpdate(
    //     { email: user.email },
    //     { isRegistered: true }
    //   );
    // }

    return res
      .status(200)
      .json({ message: "Email Verified Successfully. You can now LogIn" });
  } catch (error) {
    console.error("verifyUser:: Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  //get user details from frontend
  //validate fields - not empty
  //check if user exists or not
  //check if user isverified
  //check password
  //generate jwtToken
  //send jwtToken in cookie along with user

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({ message: "All field are require" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not Found or Didn't registered" });
    }

    if (user.isVerified == false) {
      return res
        .status(400)
        .json({ message: "Please verify Your Email First" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid User Password" });
    }

    const jwtToken = await user.generateJwtToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("Token", jwtToken, options)
      .json({ message: " User Logged in Successfully ", user: loggedInUser });

  } catch (error) {
    console.log("loginUser:: Error: ", error);

  }
};

const logoutUser = async (req, res) => {
  // clear all cookies
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    return res
      .status(200)
      .clearCookie("Token", options)
      .json({ message: "User Logged Out" });
  } catch (error) {
    console.log("logoutUser:: Error ", error);
  }
};

const forgotPassword = async (req, res) => {
  // get email from user
  // check user
  // generate resetPasswordToken and expiresAt
  // create url with resetPasswordToken
  // send email having link
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: "Email field is required" })
    }

    const user = await User.findOne({ email: email }).select("-password")
    if (!user) {
      return res.status(400).json({ message: "Invalid Email || User Not Found with this Email" })
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hr

    const sendEmail = await sendRestPasswordEmail(user.email, resetPasswordToken)
    if (!sendEmail) {
      return res.status(400).json({ message: "Failed to send reset Password mail" })
    }

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpiresAt = resetTokenExpiresAt

    await user.save()

    return res.status(200).json({ message: "Password reset email sent Successfully" })

  } catch (error) {
    console.log("forgot-Password:: ERROR: ", error);

  }
}

const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params
    const { newPassword, confirmPassword } = req.body

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Incorrect confirm Password" })
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() }
    }).select("-password")

    if (!user) {
      return res.status(400).json({ message: "Invalid Token or Expired Token" })
    }

    // user.password = await bcrypt.hash(newPassword,10) // don't need to hash again
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined
    await user.save()

    await sendSuccessResetPasswordEmail(user.email)

    return res.status(200).json({ message: "Password Reset Successfully" })

  } catch (error) {
    console.log("Reset-Password:: ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        name: { $regex: req.query.search, $options: "i" },
      }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id }, // exclude current user
    }).select("name email profilePicture role department");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "User Not Found !" });
    }

    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword);

    if (!currentPassword && !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const checkPassword = await user.isPasswordCorrect(currentPassword);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed Successfully !" });

  } catch (error) {
    console.log("change-Password:: ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }


}

export { registerUser, verifyUser, loginUser, logoutUser, forgotPassword, resetPassword, changePassword, getAllUsers, getCurrentUser };
