import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCodingSocket } from "../../hooks/CodingSocket";
import { codeModifiedEvent } from "../../hooks/SocketEvents";
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
  const { code, setCode, output, setOutput, codingSocketRef } =
    useCodingSocket(roomId);

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
    codingSocketRef.current?.emit(codeModifiedEvent, modifiedCode);
  };

  return (
    <div className="bg-slate-700 h-screen w-screen text-white flex flex-col">
      <Head>
        <title>Coding Room: {roomId}</title>
      </Head>
      <h3 className="lg:text-left m-5 mb-0 flex-row">User: {name}</h3>
      <h3 className="lg:text-left m-5 mt-1 flex-row">
        Room ID: {roomId}
        <button
          className="border-teal-700 border-2 rounded-lg p-1 ml-2"
          onClick={handleCopyButton}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </h3>
      <div className="flex h-3/5">
        <CodeEditor code={code} onChange={onCodeChange} />
        <div className="w-2/5 bg-slate-900 relative">
          Output
          <div className="absolute bottom-0 left-0">
            <button className="bg-green-600 py-3 px-6 rounded-lg">Run</button>
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
