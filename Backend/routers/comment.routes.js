import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/createComment").post(verifyJWT,createComment)
router.route("/updateComment/:commentId").put(verifyJWT,updateComment)
router.route("/deleteComment/:commentId").delete(verifyJWT,deleteComment)
router.route("/getComments/:postId").get(verifyJWT,getComments)

export default router