import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocketIOClient } from "../services/socket";
import { CodeState, SaveCode } from "../types/codingTypes";
import {
  codeExecutionEvent,
  codeModifiedEvent,
  codeSaveEvent,
  joinRoomEvent,
} from "./SocketEvents";

export function useCodingSocket(roomId: string) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const codingSocketRef = useRef<Socket>();

  // update code state
  useEffect(() => {
    const codingSocket = getSocketIOClient();

    codingSocketRef.current = codingSocket;

    codingSocket.emit(joinRoomEvent, roomId);

    codingSocket.on(codeModifiedEvent, (codeState: CodeState) => {
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
