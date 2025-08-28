import { Router } from "express";
import {uploadPreApprovedUsers,loginAdmin,getPreApprovedUsers} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/upload-users").post(upload.single("file"),uploadPreApprovedUsers);
router.route("/getPreApprovedUsers").get(getPreApprovedUsers);

export default router;