import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { sendMessage,allMessages } from "../controllers/message.controller.js";

const router = Router()

router.route("/").post(verifyJWT,sendMessage);
router.route("/:chatId").get(verifyJWT,allMessages)

export default router;