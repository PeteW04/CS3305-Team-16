import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import "../CSS-files/MessageListcomponent.css";
import { getChannels } from "../api/channel";
import { useAuth } from "../context/AuthContext";
import AvatarImage from "./AvatarImage";
import { getProfilePictureUrl } from "../api/users";

// Helper function to get the chat partner from members array (for one-on-one chats)
const getChatPartner = (channel, currentUserId) => {
  if (channel.type !== "group" && Array.isArray(channel.members)) {
    return channel.members.find(member => member._id !== currentUserId);
  }
  return null;
};

// Helper function to find channels with the newest latestMessage
function getMostRecentChannel(channels) {
  let mostRecent = null;
  let latestTime = 0;

  channels.forEach((ch) => {
    if (ch.latestMessage) {
      const msgTime = new Date(ch.latestMessage.createdAt).getTime();
      if (msgTime > latestTime) {
        mostRecent = ch;
        latestTime = msgTime;
      }
    }
  });

  return mostRecent;
}


export default function MessageList() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getChannels();
        setChannels(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchChannels();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

    const recentChannel = getMostRecentChannel(channels);

    const partner = recentChannel ? getChatPartner(recentChannel, user._id) : null;

    const partnerPicUrl =
      partner && partner.profilePicture
        ? getProfilePictureUrl(partner.profilePicture)
        : "";


    console.log("Recent channel partner:", partner);



    return (
      <div className="container">
        <div className="message-box">
          {/* HEADER */}
          <div className="header bg-gray-50 p-4 rounded-t-lg">
            <div className="title" style={{ display: "flex", alignItems: "center" }}>
              <MessageCircle className="message-icon" size={24}/>
              <span style={{ marginRight: "0.75rem", fontSize: "1.25rem", fontWeight: "600" }}>Message</span>
              
              {/* 3) Show partner's profile picture next to "Message" */}
              {partner && partner.profilePicture ? (
                <img
                  src={partnerPicUrl}
                  alt={`${partner.firstName} ${partner.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
  
            {/* Existing avatar-group: shows multiple channel avatars */}
            <div className="avatar-group flex space-x-2">
              {channels.slice(0, 4).map((channel) => {
                let avatarContent = null;
  
                if (channel.avatarUrl) {
                  avatarContent = (
                    <img
                      src={channel.avatarUrl}
                      alt="User avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=40&width=40";
                      }}
                    />
                  );
                } else {
                  const chatPartner = getChatPartner(channel, user._id);
                  if (chatPartner && chatPartner.profilePicture) {
                    avatarContent = (
                      <AvatarImage
                        profilePicture={chatPartner.profilePicture}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    );
                  } else {
                    avatarContent = (
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    );
                  }
                }
  
                return (
                  <div key={channel._id} className="avatar">
                    {avatarContent}
                  </div>
                );
              })}
              {channels.length > 4 && (
                <div className="avatar-more">+{channels.length - 4}</div>
              )}
            </div>
          </div>
  
          {/* MESSAGE LIST */}
          <div className="message-list p-4 space-y-4">
            {channels.map((channel) => (
              <div key={channel._id} className="message-item p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="message-content">
                  <h3 className="text-lg font-semibold">
                    {channel.name ||
                      (channel.type !== "group" &&
                        getChatPartner(channel, user._id)
                          ? `${getChatPartner(channel, user._id).firstName} ${getChatPartner(channel, user._id).lastName}`
                          : "Group Chat")}
                  </h3>
                  <p className="text-base text-gray-600">
                    {channel.latestMessage
                      ? channel.latestMessage.text
                      : "No messages yet."}
                  </p>
                </div>
                <div className="message-meta">
                  <span className="time text-sm text-gray-500">
                    {channel.latestMessage &&
                      new Date(channel.latestMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                  {channel.unreadCount > 0 && (
                    <span className="unread-badge bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">{channel.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
