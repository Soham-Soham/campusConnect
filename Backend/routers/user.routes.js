import {Router} from "express";
import { changePassword, forgotPassword, getAllUsers, getCurrentUser, loginUser, logoutUser, registerUser, resetPassword, verifyUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.single("profilePicture"),registerUser)
router.route("/verify/:token").get(verifyUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:resetToken").post(resetPassword)
router.route("/getAllUsers").get(verifyJWT,getAllUsers)
router.route("/currentUser").get(verifyJWT,getCurrentUser)
router.route("/changePassword").post(verifyJWT,changePassword)
export default router;