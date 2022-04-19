import Image from "next/image";
import astronaut from "../public/astronaut.png";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { createRoom } from "../services/room";

const HeroSection = () => {
  return (
    <div className="container mx-auto flex flex-col-reverse items-center lg:flex-row gap-6 pt-20 w-8/12 ">
      <div className="lg:w-1/2 flex flex-col items-center lg:pt-20 ">
        <HeroDescription />
        <HeroLogin />
      </div>
      <HeroImage />
    </div>
  );
};

const HeroDescription = () => {
  return (
    <div className="flex flex-1 flex-col items-center lg:items-start lg:pl-5">
      <h2 className="text-3xl md:text-4 lg:text-4xl lg:text-left text-center mb-6">
        {"Let's grind some "}
        <a
          href="https://leetcode.com/"
          target="_blank"
          className="text-orange-400 underline"
          rel="noreferrer"
        >
          LeetCode
        </a>{" "}
        with LeetGrindr!
      </h2>
      <p className="mb-6 text-lg lg:text-2xl">
        Interactive coding platform to practice technical interviews with your
        friends!
      </p>
    </div>
  );
};

type FormData = {
  roomId: string;
  name: string;
};

const HeroLogin = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [createRoomError, setCreateRoomError] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    localStorage.setItem("name", name);
  };

  const onSubmit = () => {
    if (roomId == "" && name == "") {
      return;
    }
    // Search for room and enter existing room
  };

  const onCreateRoomClick = async () => {
    const roomId = await createRoom();
    console.log(roomId);
    if (!roomId) {
      setCreateRoomError(true);
      return;
    }
    router.push(`/room/${roomId}`);
  };

  return (
    <form className="bg-slate-900 rounded px-8 pt-6 pb-8 mb-4 lg:w-8/12">
      <div className="mb-6">
        <label className="block text-gray-200 text-sm font-bold mb-2">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200  leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Name"
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-200 text-sm font-bold mb-2">
          Create New Room
        </label>
        <div className="flex items-center justify-between">
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onCreateRoomClick}
          >
            Create New Room
          </button>
        </div>
      </div>
      <div className="block text-gray-200 text-sm font-bold mb-6">
        OR join an existing room below!
      </div>
      <div className="mb-4">
        <label className="block text-gray-200 text-sm font-bold mb-2">
          Room ID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          id="roomId"
          type="text"
          placeholder="Room ID"
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Join Room
        </button>
      </div>
      {createRoomError && (
        <h1 className="text-red-400">
          Sorry, something went wrong, please try again
        </h1>
      )}
    </form>
  );
};

const HeroImage = () => {
  return (
    <div className="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0">
      <Image src={astronaut} alt="" width={500} height={500} />
    </div>
  );
};

export default HeroSection;
