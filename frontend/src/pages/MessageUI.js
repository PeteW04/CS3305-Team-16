import { useState, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import ChatList from "../components/ChatList";
import ChatBubble from "../components/chatBubble";
import "../CSS-files/MessageUI.css";
import { getMessages, getChannels, markMessagesRead } from "../api/channel";
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

  useEffect(() => {
    if (selectedChat && user?._id) {
      // Handle new messages
      const handleNewMessage = async (newMsg) => {
        // Only handle messages if they're for the current chat and from another user
        if (newMsg.channelId === selectedChat._id && newMsg.senderId._id !== user._id) {
          // Automatically mark message as read if chat is open
          await markMessagesRead(selectedChat._id);

          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMsg],
          }));
        }
      };

      // Handle read receipts
      const handleReadReceipts = ({ channelId, messages }) => {
        if (selectedChat._id === channelId) {
          setSelectedChat(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              messages.find(m => m._id === msg._id) || msg
            )
          }));

          // Update chats list to reflect read status
          setChats(prevChats => prevChats.map(chat =>
            chat._id === channelId
              ? {
                ...chat,
                messages: chat.messages?.map(msg =>
                  messages.find(m => m._id === msg._id) || msg
                ),
                latestMessage: {
                  ...chat.latestMessage,
                  readBy: messages.find(m => m._id === chat.latestMessage?._id)?.readBy || []
                }
              }
              : chat
          ));
        }
      };

      // Set up socket event listeners
      socket.on("newMessage", handleNewMessage);
      socket.on("messagesRead", handleReadReceipts);

      // Cleanup function
      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messagesRead", handleReadReceipts);
      };
    }
  }, [selectedChat, user?._id]);





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

      // Mark messages as read when selecting chat
      try {
        await markMessagesRead(chat._id);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      try {
        const newMessage = await sendMessage({
          channelId: selectedChat._id,
          text: message
        });

        // Only update the UI for the sender's own message
        // The socket will handle messages from other users
        if (newMessage.senderId._id === user._id) {
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
          }));

          // Update chats list with new latest message
          setChats(prevChats => prevChats.map(chat =>
            chat._id === selectedChat._id
              ? {
                ...chat,
                latestMessage: {
                  text: message,
                  createdAt: new Date(),
                  senderId: user
                }
              }
              : chat
          ));
        }

        setMessage("");
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
                    currentUser={user._id}
                    message={msg.text}
                    time={new Date(msg.createdAt).toLocaleTimeString()}
                    readBy={msg.readBy} // Add this line
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
