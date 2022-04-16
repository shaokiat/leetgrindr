import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

const CodeEditor = dynamic(import("../../components/CodeEditor"), {
  ssr: false,
});

interface RoomProps {
  roomId: string;
}

const Room: NextPage<RoomProps> = ({ roomId }) => {
  // const {code, setCode, output} // Create coding socket
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
  };

  return (
    <div className="bg-slate-700 min-h-screen min-w-screen text-white flex flex-col">
      <Head>
        <title>Coding Room</title>
      </Head>
      <h3 className="lg:text-left m-5 flex-row">
        Room ID: {roomId}
        <button
          className="border-teal-700 border-2 rounded-lg p-1 ml-2"
          onClick={handleCopyButton}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </h3>
      <div className="h-4/5">
        <CodeEditor code={"Hello"} />
      </div>
    </div>
  );
};

export default Room;
