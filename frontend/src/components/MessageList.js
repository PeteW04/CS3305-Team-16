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
          <div className="header">
            <div className="title" style={{ display: "flex", alignItems: "center" }}>
              <MessageCircle className="message-icon" />
              <span style={{ marginRight: "0.75rem" }}>Message</span>
              
              {/* 3) Show partner's profile picture next to "Message" */}
              {partner && partner.profilePicture ? (
                <img
                  src={partnerPicUrl}
                  alt={`${partner.firstName} ${partner.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
  
            {/* Existing avatar-group: shows multiple channel avatars */}
            <div className="avatar-group">
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
          <div className="message-list">
            {channels.map((channel) => (
              <div key={channel._id} className="message-item">
                <div className="message-content">
                  <h3>
                    {channel.name ||
                      (channel.type !== "group" &&
                        getChatPartner(channel, user._id)
                          ? `${getChatPartner(channel, user._id).firstName} ${getChatPartner(channel, user._id).lastName}`
                          : "Group Chat")}
                  </h3>
                  <p>
                    {channel.latestMessage
                      ? channel.latestMessage.text
                      : "No messages yet."}
                  </p>
                </div>
                <div className="message-meta">
                  <span className="time">
                    {channel.latestMessage &&
                      new Date(channel.latestMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                  {channel.unreadCount > 0 && (
                    <span className="unread-badge">{channel.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

//   return (
//     <div className="container">
//       <div className="message-box">
//         <div className="header">
//           <div className="title">
//             <MessageCircle className="message-icon" />
//             <span>Message</span>
//           </div>
//           <div className="avatar-group">
//             {channels.slice(0, 4).map((channel) => {
//               let avatarContent = null;
//               if (channel.avatarUrl) {
//                 avatarContent = (
//                   <img
//                     src={channel.avatarUrl}
//                     alt="User avatar"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "/placeholder.svg?height=40&width=40";
//                     }}
//                   />
//                 );
//               } else {
//                 const partner = getChatPartner(channel, user._id);
//                 if (partner && partner.profilePicture) {
//                   avatarContent = (
//                     <AvatarImage
//                       profilePicture={partner.profilePicture}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   );
//                 } else {
//                   avatarContent = (
//                     <img
//                       src="/placeholder.svg?height=40&width=40"
//                       alt="User avatar"
//                     />
//                   );
//                 }
//               }
//               return (
//                 <div key={channel._id} className="avatar">
//                   {avatarContent}
//                 </div>
//               );
//             })}
//             {channels.length > 4 && (
//               <div className="avatar-more">+{channels.length - 4}</div>
//             )}
//           </div>
//         </div>

//         <div className="message-list">
//           {channels.map((channel) => (
//             <div key={channel._id} className="message-item">
//               <div className="message-content">
//                 <h3>
//                   {channel.name ||
//                     (channel.type !== "group" &&
//                       getChatPartner(channel, user._id)
//                         ? `${getChatPartner(channel, user._id).firstName} ${getChatPartner(channel, user._id).lastName}`
//                         : "Group Chat")}
//                 </h3>
//                 <p>
//                   {channel.latestMessage
//                     ? channel.latestMessage.text
//                     : "No messages yet."}
//                 </p>
//               </div>
//               <div className="message-meta">
//                 <span className="time">
//                   {channel.latestMessage &&
//                     new Date(channel.latestMessage.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                 </span>
//                 {channel.unreadCount > 0 && (
//                   <span className="unread-badge">{channel.unreadCount}</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
