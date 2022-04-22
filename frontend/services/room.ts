import axios from "axios";

function getServerURL(): string {
  const roomServerUrl = process.env.NEXT_PUBLIC_ROOM_SERVER;
  if (process.env.NODE_ENV == "development") {
    return "http://localhost:5000";
  } else {
    return `https://${roomServerUrl}` || "http://localhost:5000";
  }
}

export async function createRoom() {
  const roomServerUrl = getServerURL();
  const result = await axios.post(`${roomServerUrl}/create-room`);

  const { success, roomId } = result.data;
  return success ? roomId : "";
}

export async function roomExist(roomId: string) {
  const roomServerUrl = getServerURL();
  const result = await axios.get(`${roomServerUrl}/room/${roomId}`);
  const { success, roomExists } = result.data;
  return success ? roomExists : "";
}
