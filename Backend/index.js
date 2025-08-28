import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Create HTTP server instance
const server = http.createServer(app);

// 2. Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// 3. Connect to MongoDB
connectDB()
  .then(() => {
    // Start the HTTP server
    server.listen(PORT, () =>
      console.log(`Server listening on PORT: ${PORT}`)
    );
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

// io setup
io.on("connection", (socket) => {
  console.log("⚡ New socket connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  //join chat room
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
  });

  socket.on("new message", (message) => {
    const chat = message.chat;
    if (!chat?.members) return;

    chat.members.forEach((member) => {
      if (member._id == message.sender._id) return;
      socket.in(member._id).emit("message received", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected!!");
  });
});
