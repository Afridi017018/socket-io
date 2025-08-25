const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, { cors: { origin: "*" } });

// In-memory message storage per room
const rooms = {
  room1: [],
  room2: [],
  room3: []
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    // Send previous messages of that room to this user
    socket.emit("room_messages", { room, messages: rooms[room] });

    // Notify other members in the room
    socket.to(room).emit("message", { system: true, text: `User ${socket.id} joined ${room}` });
  });

  // Send message to a specific room
  socket.on("send_message", ({ room, text }) => {
    const msg = { user: socket.id, text };
    rooms[room].push(msg); // store message

    // Broadcast to all clients in that room
    io.in(room).emit("message", msg);
  });

  // Leave a room
  socket.on("leave_room", (room) => {
    socket.leave(room);
    socket.to(room).emit("message", { system: true, text: `User ${socket.id} left ${room}` });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));
