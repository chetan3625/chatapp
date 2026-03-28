const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// simple user map
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join with userId
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log("User joined:", userId);
  });

  // send message
  socket.on("send_message", ({ to, message, from }) => {
    console.log("Message:", message);

    const receiverSocket = users[to];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", {
        message,
        from,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
