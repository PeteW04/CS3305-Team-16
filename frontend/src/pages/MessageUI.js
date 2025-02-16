import { useState, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import ChatList from "../components/ChatList";
import "../CSS-files/MessageUI.css";
import { getMessages, getChannels } from "../api/channel"; // Import both APIs
import { sendMessage } from "../api/message";
import socket from "../utils/socket";

export default function MessageUI() {
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]); // Centralized state for channels

  // Fetch channels once when the component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const channels = await getChannels(); // Fetch all available channels
        console.log(channels);
        setChats(channels); // Store channels in state
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      }
    };

    fetchChats();
  }, []);

  // Handle chat selection (fetch messages for the selected chat)
  const handleChatSelect = async (chat) => {
    console.log("Selected Chat in MessageUI:", chat); // Debugging

    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      return;
    }

    try {
      const messages = await getMessages(chat._id); // Fetch messages for selected channel
      setSelectedChat({ ...chat, messages }); // Update selected chat with its messages
      socket.emit("joinRoom", chat._id); // Join room for real-time updates
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };


  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      try {
        const newMessage = await sendMessage({
          channelId: selectedChat._id,
          text: message,
        });
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage], // Append new message to chat
        }));
        setMessage(""); // Clear input field
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  // Listen for real-time updates via Socket.IO
  useEffect(() => {
    if (selectedChat) {
      socket.on("newMessage", (newMsg) => {
        if (newMsg.channelId === selectedChat.id) {
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMsg],
          }));
        }
      });

      return () => socket.off("newMessage");
    }
  }, [selectedChat]);

  return (
    <div className="chat-interface">
      {/* Pass chats and onChatSelect to ChatList */}
      <ChatList chatData={chats} onChatSelect={handleChatSelect} />

      <div className="main-content">
        <div className="chat-container">
          <div className="messages">
            {selectedChat ? (
              selectedChat.messages.map((msg, index) => (
                <div key={index} className={`message ${msg.senderId === "currentUserId" ? "sent" : ""}`}>
                  <p>{msg.text}</p>
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <p>Select a chat to start messaging</p>
            )}
          </div>

          {selectedChat && (
            <form className="chat-input" onSubmit={handleSendMessage}>
              <button type="button" className="emoji-button">
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder="Start typing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
