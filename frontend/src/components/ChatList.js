import { useState } from "react";
import { Plus, Users, Briefcase, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import "../CSS-files/MessageList.css";

export default function ChatList({ onChatSelect, chatData }) {
  const [activeChat, setActiveChat] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    directMessages: true,
    groupChats: true,
    projectChats: true,
  });

  const handleChatClick = (chat) => {
    console.log("Selected Chat from ChatList:", chat);
    setActiveChat(chat._id);
    onChatSelect(chat); // Notify parent of the selected chat
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderChatItem = (chat) => (
    <div
      key={chat.id || chat._id}
      className={`chat-item ${activeChat === (chat.id || chat._id) ? "active" : ""}`}
      onClick={() => handleChatClick(chat)}
    >
      <div className="chat-item-content">
        <div className="chat-item-header">
          <span className="chat-item-name">{chat.name}</span>
          <span className="chat-item-time">{chat.lastMessageTime}</span>
        </div>
        <p className="chat-item-message">{chat.lastMessage}</p>
      </div>
      {chat.unread > 0 && <div className="chat-item-badge">{chat.unread}</div>}
    </div>
  );

  const renderChatSection = (title, icon, chats, sectionKey) => (
    <div className="chat-category">
      <h3 className="category-title" onClick={() => toggleSection(sectionKey)}>
        {expandedSections[sectionKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {icon}
        <span>{title}</span>
      </h3>
      <div className={`chat-items ${expandedSections[sectionKey] ? "expanded" : ""}`}>
        {chats.map(renderChatItem)}
      </div>
    </div>
  );

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <button className="new-chat-button">
          <Plus size={16} />
          <span>Add New Chat</span>
        </button>
      </div>

      {/* Render categorized chats */}
      {renderChatSection("Direct Messages", <MessageSquare size={16} />, chatData.filter(c => c.type === 'direct-message'), "directMessages")}
      {renderChatSection("Group Chats", <Users size={16} />, chatData.filter(c => c.type === 'group'), "groupChats")}
      {renderChatSection("Project Chats", <Briefcase size={16} />, chatData.filter(c => c.type === 'project'), "projectChats")}
    </div>
  );
}
