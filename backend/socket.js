import { Server } from "socket.io";

export function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  return io;
}
