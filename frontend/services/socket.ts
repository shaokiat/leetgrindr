import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

export function getSocketIOClient(): Socket {
  if (process.env.NODE_ENV == "development") {
    return io("ws://localhost:5000", { transports: ["websocket"] });
  } else {
    const serverUrl = process.env.NEXT_PUBLIC_ROOM_SERVER;
    return io(`ws://${serverUrl}`, { transports: ["websocket"] });
  }
}
