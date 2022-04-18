import "dotenv/config";
import express from "express";
import cors from "cors";
import { v4 } from "uuid";
import { createClient } from "redis";
import { createServer } from "http";
import { initializeSocketServer } from "./socket.js";

const PORT = 5000;
const client = createClient({ url: process.env.REDIS_URL });
const app = express();
const server = createServer(app);
const io = initializeSocketServer(server);

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

client.on("error", console.error);
// Connect to redis
client
  .connect()
  .then(() => console.log("Connected to redis!"))
  .catch(() => {
    console.error("Error connecting to redis");
  });

// For aws healthcheck
app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

app.get("/room/:roomId", async(req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = await client
    .hGetAll(roomId)
    .catch((err) => {
      console.log(1, err);
    });
  if (!roomInfo) {
    res.status(200).json({
      success:true,
      roomExists: false,
    })
  } else {
    res.status(200).json({
      success:true,
      roomExists:true,
    })
  }
})

app.post("/create-room", async (req, res) => {
  const roomId = v4();

  const createRoom = await client
    .hSet(roomId, {
      roomId: roomId,
      content: "",
      language: "PYTHON",
    })
    .catch((err) => {
      console.log(1, err);
    });
  await client.expire(roomId, 86400);
  
  if (!createRoom) {
    res.status(500).json({
      success:false,
      roomId:"",
      errorMessage: "Server Error: Failed to create room."
    })
  } else {
    res.status(200).json({
      success: true,
      roomId: roomId
  });
  }
});

io.on("connection", (socket) => {
  console.log("NEW USER");
  socket.on("joinRoomEvent", async (roomId, name) => {
    console.log(roomId)
    socket.join(roomId);
    const roomCodeState = await client.hGetAll(socket.id);
    const initialCodeState = {
      code: roomCodeState.code,
    };
    socket.emit("initialState", initialCodeState);
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
