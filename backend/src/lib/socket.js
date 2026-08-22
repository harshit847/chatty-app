import { Server } from "socket.io";
import http from "http";
import express from "express";
import { isAllowedOrigin } from "./origins.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  },
});

const userSocketMap = {}; // { userId: Set(socketIds) }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    //console.log("🗺️ userSocketMap:", userSocketMap);

  });
});


export function getReceiverSocketId(userId) {
  const sockets = userSocketMap[userId];
  return sockets ? Array.from(sockets)[0] : null;
}

export { io, app, server };
