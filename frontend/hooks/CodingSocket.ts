import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocketIOClient } from "../services/socket";
import { CodeState, SaveCode } from "../types/codingTypes";
import {
  codeExecutionEvent,
  codeModifiedEvent,
  codeSaveEvent,
  initialStateEvent,
  joinRoomEvent,
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

    codingSocket.emit(joinRoomEvent, { roomId: roomId, name: name });

    codingSocket.on(codeModifiedEvent, (codeState: CodeState) => {
      setCode(codeState.code);
    });

    codingSocket.on(initialStateEvent, (codeState: CodeState) => {
      console.log("INITIAL STATE");
      setCode(codeState.code);
    });

    codingSocket.on(codeExecutionEvent, (newOutput: string) => {
      setOutput(output + "\n" + newOutput);
    });
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
      socket?.emit(codeSaveEvent, saveCode);
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
