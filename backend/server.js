import "dotenv/config";
import express from "express";
import cors from "cors";
import { v4 } from "uuid";
import { createClient } from "redis";
import { createServer } from "http";
import { initializeSocketServer } from "./socket.js";
import { CODE_EXECUTED_EVENT, CODE_MODIFIED_EVENT, CODE_SAVED_EVENT, DISCONNECT_ROOM_EVENT, INITIALSTATE, JOIN_ROOM_EVENT, ROOM_CONNECTION } from "./socketEvents.js";
import { runPython } from "./runPython.js";

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
  socket.on(JOIN_ROOM_EVENT, async (data) => {
    const {roomId, name} = data

    await client.lPush(`${roomId}:users`, `${name}`)
    await client.expire(`${roomId}:users`, 86400)

    const users = await client.lRange(`${roomId}:users`, 0, -1)
    socket.join(roomId);

    const {content} = await client.hGetAll(roomId);
    const initialCodeState = {
      code: content,
    };
    socket.emit(INITIALSTATE, initialCodeState);
    io.in(roomId).emit(ROOM_CONNECTION, users)
  });

  socket.on(CODE_MODIFIED_EVENT, async (modifiedCode) => {
    const {roomId, codeState} = modifiedCode
    socket.to(roomId).emit(CODE_MODIFIED_EVENT, codeState)
  })

  socket.on(DISCONNECT_ROOM_EVENT, async (data) => {
    const {roomId, name} = data
    const users = await client.lRange(`${roomId}:users`, 0, -1)
    const newUsers = users.filter((user) => name !== user)
    if (newUsers.length) {
      await client.del(`${roomId}:users`)
      await client.lPush(`${roomId}:users`, newUsers)
    } else {
      await client.del(`${roomId}:users`)
    }
    io.in(roomId).emit(ROOM_CONNECTION, newUsers)
  }) 

  socket.on(CODE_SAVED_EVENT, async (saveCodeMessage) => {
    const { roomId, codeState } = saveCodeMessage
    await client.hSet(roomId, {
      roomId: roomId,
      content: codeState.code,
      language: "PYTHON"
    }).catch((err) => {
      console.log(5, err);
    });
  })

  socket.on(CODE_EXECUTED_EVENT, async (executeCodeMessage) => {
    const { roomId, codeState } = executeCodeMessage
    const output = await runPython(codeState.code)
    io.to(roomId).emit(CODE_EXECUTED_EVENT, output)
  })
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
