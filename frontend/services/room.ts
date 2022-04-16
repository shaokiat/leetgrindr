import axios from "axios";

function getServerURL(): string {
  const env = process.env.NODE_ENV;
  if (env == "development") {
    return "http://localhost:5000";
  } else {
    return process.env.NEXT_ROOM_SERVER;
  }
}

export async function createRoom() {
  const roomServerUrl = getServerURL();
  const result = await axios.post(`${roomServerUrl}/create-room`);

  const { success, roomId } = result.data;
  return success ? roomId : "";
}
