import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


const userSocketMap = {}; // {userId: socket.id}

export const getRecipientSocketId = (recipientId) => userSocketMap[recipientId];

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // id of each user in array => [1,2,3,4]

  socket.on("markMessagesAsSeen", async ({conversationId, userId})=>{
    try {
      await Message.updateMany({conversationId: conversationId, seen: false}, {$set: {seen: true}})
      await Conversation.updateOne({_id:conversationId}, {$set: {"lastMessage.seen ": true}})
      io.to(userSocketMap[userId]).emit("messagesSeen", {conversationId})
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
