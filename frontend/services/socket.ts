import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

export function getSocketIOClient(): Socket {
  if (process.env.NODE_ENV == "development") {
    return io("ws://localhost:5000");
  } else {
    const serverUrl = process.env.NEXT_ROOM_SERVER;
    return io(`${serverUrl}`, {
      path: "/code-collab/socket.io",
    });
  }
}
