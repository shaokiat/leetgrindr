import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocketIOClient } from "../services/socket";
import { CodeState, SaveCode, Users } from "../types/codingTypes";
import {
  CODE_EXECUTED_EVENT,
  CODE_MODIFIED_EVENT,
  CODE_SAVED_EVENT,
  DISCONNECT_ROOM_EVENT,
  INITIALSTATE,
  JOIN_ROOM_EVENT,
  ROOM_CONNECTION,
} from "./SocketEvents";

export function useCodingSocket(roomId: string) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const codingSocketRef = useRef<Socket>();

  const codingSocket = getSocketIOClient();

  // update code state
  useEffect(() => {
    codingSocketRef.current = codingSocket;

    const name = localStorage.getItem("name");

    codingSocket.emit(JOIN_ROOM_EVENT, { roomId: roomId, name: name });

    codingSocket.on(CODE_MODIFIED_EVENT, (codeState: CodeState) => {
      setCode(codeState.code);
    });

    codingSocket.on(INITIALSTATE, (codeState: CodeState) => {
      setCode(codeState.code);
    });

    codingSocket.on(CODE_EXECUTED_EVENT, (newOutput: string) => {
      console.log(newOutput);
      setOutput(output + "\n" + newOutput);
    });

    codingSocket.on(ROOM_CONNECTION, (users: Users) => {
      console.log(`Users in room: ${users}`);
    });

    return () => {
      codingSocket.emit(DISCONNECT_ROOM_EVENT, { roomId, name });
    };
  }, [roomId]);

  useEffect(() => {
    const socket = codingSocketRef.current;

    const saveCode: SaveCode = {
      roomId,
      codeState: {
        code: code,
      },
    };

    const interval = setInterval(() => {
      socket?.emit(CODE_SAVED_EVENT, saveCode);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [code, roomId]);

  return {
    code,
    setCode,
    output,
    setOutput,
    codingSocketRef,
  };
}
