import Image from "next/image";
import astronaut from "../public/astronaut.png";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { createRoom, roomExist } from "../services/room";

const HeroSection = () => {
  return (
    <div className="container mx-auto flex flex-col-reverse items-center lg:flex-row gap-6 pt-20 w-8/12 ">
      <div className="lg:w-2/3 flex flex-col items-center lg:pt-24 ">
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

const HeroLogin = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [createRoomError, setCreateRoomError] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    localStorage.setItem("name", name);
  };

  const onJoinRoomClick = async () => {
    if (roomId == "" && name == "") {
      setJoinError(true);
      return;
    }
    // Search for room and enter existing room
    const roomExists = roomExist(roomId);
    if (!roomExists) {
      setJoinError(true);
      return;
    } else {
      router.push(`/room/${roomId}`);
    }
  };

  const onCreateRoomClick = async () => {
    if (name == "") {
      setCreateRoomError(true);
      return;
    }
    const roomId = await createRoom();
    if (!roomId) {
      setCreateRoomError(true);
      return;
    }
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:mt-10 w-full">
      <form className="bg-slate-900 rounded px-8 pt-6 pb-8 mb-4 lg:w-5/12 w-full">
        <div className="mb-6">
          <label className="block text-gray-200 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
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
        {createRoomError && (
          <h1 className="text-red-400">
            Sorry, something went wrong, please try again
          </h1>
        )}
      </form>
      <div className="flex justify-center align-middle lg:w-2/12 w-full mb-3">
        <div className="text-gray-200 text-lg font-bold m-auto text-center">
          OR
        </div>
      </div>
      <form className="bg-slate-900 rounded px-8 pt-6 pb-8 mb-4 lg:w-5/12 w-full">
        <div className="mb-6">
          <label className="block text-gray-200 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">
            Room ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="roomId"
            type="text"
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mb-5">
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onJoinRoomClick}
          >
            Join Room
          </button>
        </div>
        {joinError && (
          <h1 className="text-red-400">
            Room not found! Please enter a correct room number.
          </h1>
        )}
      </form>
    </div>
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
