import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js"
import { accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup } from "../controllers/chat.controller.js";

const router = express.Router()

router.route("/").post(verifyJWT,accessChat);
router.route("/").get(verifyJWT,fetchChat);
router.route("/group").post(verifyJWT,createGroupChat);
router.route("/rename").put(verifyJWT,renameGroup);
router.route("/groupremove").put(verifyJWT,removeFromGroup);
router.route("/groupadd").put(verifyJWT,addToGroup);

export default router; 