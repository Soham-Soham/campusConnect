import { Router } from "express";
import { createPost, deletePost, getAllPosts, getMyPosts, updatePost } from "../controllers/post.contoller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createPost").post(verifyJWT,upload.single("postImage"),createPost)
router.route("/deletePost/:postId").delete(verifyJWT,deletePost)
router.route("/updatePost/:postId").put(verifyJWT,upload.single("postImage"),updatePost)
router.route("/allPosts").get(verifyJWT,getAllPosts)
router.route("/myPosts").get(verifyJWT,getMyPosts)

export default router;