import io from "socket.io-client";
import { useState } from "react";
import Join from "./join";
import Chat from "./chat";

const socket = io("https://vercel-backend-i6bu.onrender.com");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>

      {!username
        ? <Join socket={socket} setUsername={setUsername} setRoom={setRoom}/>
        : <Chat socket={socket} username={username} room={room}/>
      }

    </div>
  );
}

export default App;