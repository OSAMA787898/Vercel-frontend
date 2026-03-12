import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

function Chat({ socket, username, room }) {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const chatEndRef = useRef(null);

  const sendMessage = () => {

    if (message !== "") {

      const messageData = {
        room: room,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString()
      };

      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  // Receive messages
  useEffect(() => {

    const handleReceiveMessage = (data) => {
      setChat((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };

  }, [socket]);


  // Typing indicator
  useEffect(() => {

    const handleTyping = (data) => {
      setTypingUser(data.username);

      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };

  }, [socket]);


  // Online users
  useEffect(() => {

    socket.on("room_users", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("room_users");
    };

  }, [socket]);


  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);



  return (

    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">

      <div className="flex w-[850px] h-[600px] bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden">

        {/* Users Sidebar */}
        <div className="w-[220px] border-r p-4">

          <h2 className="font-bold mb-4 text-lg">
            Users ({users.length})
          </h2>

          <div className="flex flex-col gap-3">

            {users.map((user, index) => (

              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg"
              >

                {/* Avatar */}
                <div className="relative">

                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username[0].toUpperCase()}
                  </div>

                  {/* Online Dot */}
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>

                </div>

                <span className="text-sm font-medium">
                  {user.username}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* Chat Area */}
        <div className="flex flex-col flex-1">

          {/* Header */}
          <div className="bg-blue-500 text-white p-4 font-bold text-lg">
            Chat Room
          </div>


          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

            {chat.map((msg, index) => (

              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.author === username ? "justify-end" : "justify-start"
                }`}
              >

                {msg.author !== username && (
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">
                    {msg.author[0].toUpperCase()}
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.author === username
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >

                  <p className="text-sm font-bold">{msg.author}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-70">{msg.time}</p>

                </div>

              </div>

            ))}

            <div ref={chatEndRef}></div>

          </div>


          {/* Typing Indicator */}
          {typingUser && typingUser !== username && (
            <p className="text-sm text-gray-500 px-4 pb-2">
              {typingUser} is typing...
            </p>
          )}


          {/* Emoji Picker */}
          {showEmoji && (
            <div className="p-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}


          {/* Input */}
          <div className="flex p-3 border-t items-center">

            <button
              className="text-2xl px-3"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              😊
            </button>

            <input
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit("typing", { username, room });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              className="bg-green-500 text-white px-5 py-2 rounded ml-2"
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Chat;