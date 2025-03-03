import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Smile, Send, Users } from "lucide-react";
import ChatList from "../components/ChatList";
import ChatBubble from "../components/chatBubble";
import "../CSS-files/MessageUI.css";
import { getMessages, getChannels, markMessagesRead } from "../api/channel";
import { sendMessage, editMessage, deleteMessage } from "../api/message";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { getProfilePictureUrl } from "../api/users.js";


export default function MessageUI() {
  const { user, isLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { projectId } = useParams();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      chats.forEach((chat) => {
        socket.emit("joinRoom", chat._id);
      });
    }
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [chats]);

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
    if (user?._id) {
      const handleGlobalNewMessage = (newMsg) => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === newMsg.channelId) {
              const isChatOpen = selectedChat?._id === chat._id;
              const isFromOtherUser = newMsg.senderId._id !== user._id;

              return {
                ...chat,
                unreadCount: isChatOpen
                  ? 0
                  : isFromOtherUser
                    ? (chat.unreadCount || 0) + 1
                    : chat.unreadCount,
                latestMessage: {
                  text: newMsg.text,
                  createdAt: newMsg.createdAt,
                  senderId: newMsg.senderId,
                  readBy: newMsg.readBy,
                },
              };
            }
            return chat;
          })
        );

        if (selectedChat?._id === newMsg.channelId) {
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMsg],
          }));
          markMessagesRead(newMsg.channelId);
        }
      };

      const handleMessageRead = ({ channelId, messages }) => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === channelId
              ? {
                ...chat,
                unreadCount: 0,
                latestMessage: {
                  ...chat.latestMessage,
                  readBy:
                    messages.find((m) => m._id === chat.latestMessage?._id)
                      ?.readBy || [],
                },
              }
              : chat
          )
        );
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
    if (user?._id) {
      const handleEditedMessage = (updatedMsg) => {
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg._id === updatedMsg._id ? { ...msg, text: updatedMsg.text } : msg
          ),
        }));
      };

      const handleDeletedMessage = ({ messageId }) => {
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev.messages.filter((msg) => msg._id !== messageId),
        }));
      };

      socket.on("editMessage", handleEditedMessage);
      socket.on("deleteMessage", handleDeletedMessage);

      return () => {
        socket.off("editMessage", handleEditedMessage);
        socket.off("deleteMessage", handleDeletedMessage);
      };
    }
  }, [user?._id]);


  const handleChatSelect = async (chat) => {
    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      return;
    }

    try {
      const messages = await getMessages(chat._id);
      setSelectedChat({ ...chat, messages });

      socket.emit("joinRoom", chat._id); // Notify server user has opened chat

      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === chat._id ? { ...c, unreadCount: 0 } : c
        )
      );

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
          text: message,
        });

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? {
                ...chat,
                latestMessage: {
                  text: newMessage.text,
                  createdAt: newMessage.createdAt,
                  senderId: newMessage.senderId,
                  readBy: newMessage.readBy,
                },
              }
              : chat
          )
        );

        setMessage("");
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      const updatedMessage = await editMessage(messageId, newText);

      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg._id === messageId ? { ...msg, text: updatedMessage.text } : msg
        ),
      }));

      socket.emit("editMessage", updatedMessage); // Emit edit event
    } catch (error) {
      console.error("Error editing message:", error.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);

      // Local state update
      setSelectedChat(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg._id !== messageId)
      }));

      // Broadcast deletion
      socket.emit("deleteMessage", {
        messageId,
        channelId: selectedChat._id // Include channel context
      });
    } catch (error) {
      console.error("Error deleting message:", error.message);
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
    <div className="h-full w-full p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-180px)]">
          <ChatList
            chatData={chats}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
          />
          <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-200">
            <div
              className="messages flex-1 overflow-y-auto py-0 px-4"
              ref={messagesContainerRef}
            >
              {selectedChat ? (
                selectedChat.messages &&
                  selectedChat.messages.length > 0 ? (

                  <>
                    <div className="flex flex-row sticky top-0 bg-white shadow-lg border-gray-200 p-6 rounded-b-lg z-50">
                      {selectedChat.type === "group" ? <Users className="w-8 h-8 rounded object-cover" /> : <img
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      }

                      <div className="pt-2 pl-3 font-semibold">
                        {selectedChat.name}
                      </div>
                    </div>
                    {selectedChat.messages.map((msg, index) => (
                      <ChatBubble
                        key={index}
                        sender={msg.senderId}
                        currentUser={user._id}
                        message={msg.text}
                        time={new Date(msg.createdAt).toLocaleString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                        readBy={msg.readBy}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        messageId={msg._id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No messages in this chat yet.
                  </p>
                )
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  Select a chat to start messaging
                </p>
              )}
            </div>
            {selectedChat && (
              <form
                className="chat-input border-t border-gray-200 p-4"
                onSubmit={handleSendMessage}
              >
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
    </div>
  );
}
