import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useCodingSocket } from "../../hooks/CodingSocket";
import {
  CODE_EXECUTED_EVENT,
  CODE_MODIFIED_EVENT,
} from "../../hooks/SocketEvents";
import { roomExist } from "../../services/room";
import { ModifiedCode } from "../../types/codingTypes";

const CodeEditor = dynamic(import("../../components/CodeEditor"), {
  ssr: false,
});

interface RoomProps {
  roomId: string;
}

const Room: NextPage<RoomProps> = ({ roomId }) => {
  const [name, setName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { code, setCode, output, execError, roomUsers, codingSocketRef } =
    useCodingSocket(roomId);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("name") || "";
    setName(name);
  }, []);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
  };

  const onCodeChange = (newCode: string) => {
    const modifiedCode: ModifiedCode = {
      roomId: roomId,
      codeState: {
        code: newCode,
      },
    };
    setCode(newCode);
    codingSocketRef.current?.emit(CODE_MODIFIED_EVENT, modifiedCode);
  };

  const handleRunButton = () => {
    const modifiedCode: ModifiedCode = {
      roomId: roomId,
      codeState: {
        code: code,
      },
    };
    codingSocketRef.current?.emit(CODE_EXECUTED_EVENT, modifiedCode);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="bg-slate-700 h-screen w-screen text-white flex flex-col">
      <Head>
        <title>Coding Room: {roomId}</title>
      </Head>
      <h3 className="lg:text-left m-5 mb-0 flex-row">User: {name}</h3>
      <h3 className="lg:text-left mx-5 mt-1 flex-row">
        Room ID: {roomId}
        <button
          className="border-teal-700 border-2 rounded-lg p-1 ml-2"
          onClick={handleCopyButton}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </h3>
      <h3 className="lg:text-left m-5 mt-1 flex-row">{`Roomies: ${roomUsers}`}</h3>
      <div className="flex h-3/5">
        <CodeEditor code={code} onChange={onCodeChange} />
        <div className="w-2/5 bg-slate-900 relative">
          <div className="p-3 font-mono whitespace-pre-wrap overflow-auto h-[90%] ">
            {execError ? (
              <p className="text-yellow-200">{output}</p>
            ) : (
              <p>{output}</p>
            )}
            <div ref={scrollRef} className="">
              {">>>"}
            </div>
          </div>
          <div className="relative h-[10%]">
            <div className="absolute bottom-0 left-0">
              <button
                className="bg-green-600 py-3 px-3 rounded-lg font-sans"
                onClick={handleRunButton}
              >
                Run Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomId = (context.params?.roomId as string) || "UNDEFINED";
  const roomExists = await roomExist(roomId);
  if (!roomExists) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {
      roomId,
    },
  };
};

export default Room;
