import { useState, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);


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

  // Remove the second useEffect with handleGlobalMessage completely
  // Modify the first useEffect to handle all message scenarios

  useEffect(() => {
    if (user?._id) {
      const handleGlobalNewMessage = (newMsg) => {
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat._id === newMsg.channelId) {
              const isChatOpen = selectedChat?._id === chat._id;
              const isFromOtherUser = newMsg.senderId._id !== user._id;

              return {
                ...chat,
                unreadCount: isChatOpen ? 0 : (isFromOtherUser ? (chat.unreadCount || 0) + 1 : chat.unreadCount),
                latestMessage: {
                  text: newMsg.text,
                  createdAt: newMsg.createdAt,
                  senderId: newMsg.senderId,
                  readBy: newMsg.readBy
                }
              };
            }
            return chat;
          })
        );

        // If the message is for the currently selected chat, update messages in `selectedChat`
        if (selectedChat?._id === newMsg.channelId) {
          setSelectedChat(prev => ({
            ...prev,
            messages: [...prev.messages, newMsg],
          }));
          markMessagesRead(newMsg.channelId);
        }
      };


      const handleMessageRead = ({ channelId, messages }) => {
        setChats(prevChats => prevChats.map(chat =>
          chat._id === channelId
            ? {
              ...chat,
              unreadCount: 0,  // Reset unread count if messages are read
              latestMessage: {
                ...chat.latestMessage,
                readBy: messages.find(m => m._id === chat.latestMessage?._id)?.readBy || []
              }
            }
            : chat
        ));
      };


      socket.on("newMessage", handleGlobalNewMessage);
      socket.on("messagesRead", handleMessageRead);

      return () => {
        socket.off("newMessage", handleGlobalNewMessage);
        socket.off("messagesRead", handleMessageRead);
      };
    }
  }, [selectedChat?._id, user?._id]);





  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("Attempting to connect socket...");
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  const handleChatSelect = async (chat) => {
    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      return;
    }

    try {
      const messages = await getMessages(chat._id);
      setSelectedChat({ ...chat, messages });

      socket.emit("joinRoom", chat._id);  // Notify server user has opened chat

      // Reset unread count to 0
      setChats(prevChats => prevChats.map(c =>
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      ));

      // Mark messages as read in the backend
      await markMessagesRead(chat._id);
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

        setChats(prevChats => prevChats.map(chat =>
          chat._id === selectedChat._id
            ? {
              ...chat,
              latestMessage: {
                text: newMessage.text,
                createdAt: newMessage.createdAt,
                senderId: newMessage.senderId,
                readBy: newMessage.readBy
              }
            }
            : chat
        ));

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
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-interface">
      <ChatList chatData={chats} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
      <div className="main-content">
        <div className="chat-container">
          <div className="messages">
            {selectedChat ? (
              selectedChat.messages && selectedChat.messages.length > 0 ? (
                <>
                  {selectedChat.messages.map((msg, index) => (
                    <ChatBubble
                      key={index}
                      sender={msg.senderId}
                      currentUser={user._id}
                      message={msg.text}
                      time={new Date(msg.createdAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}

                      readBy={msg.readBy}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
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
