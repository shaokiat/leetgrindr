import React, { useRef, useState } from "react";
import { Socket } from "socket.io-client";

export function useCodingSocket(roomId: string) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const codingSocketRef = useRef<Socket>();

  return {
    code,
    setCode,
    output,
    setOutput,
    codingSocketRef,
  };
}
