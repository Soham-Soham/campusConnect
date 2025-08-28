import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { likePost, unlikePost } from "../controllers/like.controller.js";

const router = Router()

router.route("/likePost").post(verifyJWT,likePost)
router.route("/unlikePost").post(verifyJWT,unlikePost)

export default router;