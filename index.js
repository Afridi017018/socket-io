const express = require("express");

const http = require("http")

const { Server } = require("socket.io");

const app = express();

const cors = require("cors");

app.use(cors())


// HTTP server
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});



io.on("connection", (socket) => {

    console.log("User connected", socket.id);


    socket.on("chat_message", (msg) => {
        console.log("Message:", msg);
        // Broadcast message to all clients
        io.emit("chat_message", msg);
    });


})




app.get("/", (req, res) => {
    res.send("Server is running ✅");
});


const port = 5000;

server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})