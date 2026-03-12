import { useEffect, useState } from "react";

function Join({ socket, setUsername, setRoom }) {

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState("join");
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromURL = params.get("room");

    if (roomFromURL) {
      setRoomId(roomFromURL);
    }
  }, []);

  const joinRoom = () => {

    if (name !== "" && roomId !== "") {

      socket.emit("join_room", {
        username: name,
        room: roomId
      });

      setUsername(name);
      setRoom(roomId);
    }
  };

  const createRoom = () => {

    const randomRoom = Math.floor(1000 + Math.random() * 9000).toString();

    setRoomId(randomRoom);
    setMode("create");

    const link = `${window.location.origin}/?room=${randomRoom}`;

    setInviteLink(link);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (

    <div className="relative flex items-center justify-center h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 overflow-hidden">

      {/* Animated Background Blobs */}

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>

      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>


      {/* Floating Icons */}

      <div className="absolute top-32 left-32 text-5xl animate-bounce opacity-80">💬</div>

      <div className="absolute bottom-32 right-32 text-5xl animate-bounce opacity-80">
        📩
      </div>

      <div className="absolute top-1/4 right-40 text-5xl animate-bounce opacity-80">
        🤖
      </div>


      {/* Glow Wrapper */}

      <div className="glow-card-wrapper">

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-[350px] flex flex-col items-center animate-fadeIn transition transform hover:scale-105">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="chat"
            className="w-24 mb-4 animate-bounce"
          />

          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            Realtime Chat
          </h2>


          {/* Join / Create Toggle */}

          <div className="flex gap-2 mb-4">

            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                mode === "join"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMode("join")}
            >
              Join Room
            </button>

            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                mode === "create"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={createRoom}
            >
              Create Room
            </button>

          </div>


          {/* Username */}

          <input
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
          />


          {/* Room ID */}

          <input
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />


          {/* Copy Room ID */}

          {mode === "create" && (
            <button
              className="text-sm text-blue-500 mb-2 hover:underline"
              onClick={copyRoomId}
            >
              Copy Room ID
            </button>
          )}


          {/* Invite Link */}

          {mode === "create" && inviteLink && (

            <div className="w-full bg-gray-100 p-2 rounded mb-3 text-sm text-gray-700 break-all">

              Invite Link:
              <br />
              {inviteLink}

              <button
                className="text-blue-500 text-sm mt-2 hover:underline"
                onClick={copyInviteLink}
              >
                Copy Invite Link
              </button>

            </div>

          )}


          {/* Join Button */}

          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={joinRoom}
          >
            Join Room
          </button>

        </div>

      </div>

    </div>

  );
}

export default Join;