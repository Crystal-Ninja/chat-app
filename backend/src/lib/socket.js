import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query?.userId;

  if (typeof userId === "string" && userId.trim()) {
    userSocketMap[userId] = socket.id;
  } else {
    console.warn("Invalid or missing userId in socket handshake query");
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Find and delete the user from userSocketMap
    for (const [id, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { io, app, server };