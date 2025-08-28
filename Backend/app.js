import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Activates the CORS middleware to enable cross-origin requests.
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// Enables the parsing of JSON payloads in incoming requests (like POST or PUT).
app.use(express.json({limit:"16kb"}))

// Parses URL-encoded data (e.g., form submissions).
app.use(express.urlencoded({extended:true, limit:"16kb"}))

// Serves static files (e.g., images, CSS, or JavaScript) from the public directory.
app.use(express.static("public"))

// Parses cookies sent with incoming HTTP requests and makes them available in req.cookies.
app.use(cookieParser())

//import routes
import userRouter from "./routers/user.routes.js";
import postRouter from "./routers/post.routes.js";
import likeRouter from "./routers/like.routes.js";
import commentRouter from "./routers/comment.routes.js";
import chatRouter from "./routers/chat.routes.js";
import messageRouter from "./routers/message.routes.js";
import adminRouter from "./routers/admin.routes.js";

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/chats",chatRouter)
app.use("/api/v1/messages",messageRouter)
app.use("/api/v1/admin",adminRouter)

export default app;