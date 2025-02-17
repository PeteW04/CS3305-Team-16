import { useState, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import ChatList from "../components/ChatList";
import ChatBubble from "../components/chatBubble";
import "../CSS-files/MessageUI.css";
import { getMessages, getChannels } from "../api/channel";
import { sendMessage } from "../api/message";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";

export default function MessageUI() {
  const { user, isLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const channels = await getChannels();
        console.log(channels);
        setChats(channels);
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat && user?._id) { // Use optional chaining to avoid errors
      const { _id: channelId } = selectedChat;

      const handleNewMessage = (newMsg) => {
        if (newMsg.channelId === channelId && newMsg.senderId !== user._id) {
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMsg],
          }));
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => socket.off("newMessage", handleNewMessage);
    }
  }, [selectedChat, user?._id]);

  useEffect(() => {
    // Connect the socket on mount
    if (!socket.connected) {
      socket.connect();
      console.log("Attempting to connect socket...");
    }

    return () => {
      // Disconnect the socket on unmount
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  const handleChatSelect = async (chat) => {
    console.log("Selected Chat in MessageUI:", chat);

    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      return;
    }

    try {
      const messages = await getMessages(chat._id);
      setSelectedChat({ ...chat, messages });
      socket.emit("joinRoom", chat._id);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      try {
        const newMessage = await sendMessage({ channelId: selectedChat._id, text: message });

        // Update local state with the newly sent message
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));

        setMessage(""); // Clear input field
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  const handleNewChat = (newChat) => {
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChat(newChat);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while user data is being fetched
  }



  return (
    <div className="chat-interface">
      <ChatList chatData={chats} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />

      <div className="main-content">
        <div className="chat-container">
          <div className="messages">
            {selectedChat ? (
              selectedChat.messages && selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    sender={msg.senderId}
                    currentUser={user._id} // Pass current user's ID
                    message={msg.text}
                    time={new Date(msg.createdAt).toLocaleTimeString()}
                  />
                ))
              ) : (
                <p>No messages in this chat yet.</p>
              )
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
