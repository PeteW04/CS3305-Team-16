"use client"

import { useState } from "react"
import { Plus, Users, Briefcase, MessageSquare, ChevronDown, ChevronRight } from "lucide-react"
import "../CSS-files/MessageList.css"



export default function ChatList({ onChatSelect, chatData}) {
  const [activeChat, setActiveChat] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    directMessages: true,
    groupChats: true,
    projectChats: true,
  })

  const handleChatClick = (chat) => {
    setActiveChat(chat.id)
    onChatSelect(chat)
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const renderChatItem = (chat) => (
    <div
      key={chat.id}
      className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
      onClick={() => handleChatClick(chat)}
    >
      <div className="chat-item-content">
        <div className="chat-item-header">
          <span className="chat-item-name">{chat.name}</span>
          <span className="chat-item-time">{chat.time}</span>
        </div>
        <p className="chat-item-message">{chat.message}</p>
      </div>
      {chat.unread > 0 && <div className="chat-item-badge">{chat.unread}</div>}
    </div>
  )

  const renderChatSection = (title, icon, chats, sectionKey) => (
    <div className="chat-category">
      <h3 className="category-title" onClick={() => toggleSection(sectionKey)}>
        {expandedSections[sectionKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {icon}
        <span>{title}</span>
      </h3>
      <div className={`chat-items ${expandedSections[sectionKey] ? "expanded" : ""}`}>{chats.map(renderChatItem)}</div>
    </div>
  )

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <button className="new-chat-button">
          <Plus size={16} />
          <span>Add New Chat</span>
        </button>
      </div>
      <div className="chats">
        {renderChatSection("Direct Messages", <MessageSquare size={16} />, chatData.directMessages, "directMessages")}
        {renderChatSection("Group Chats", <Users size={16} />, chatData.groupChats, "groupChats")}
        {renderChatSection("Project Chats", <Briefcase size={16} />, chatData.projectChats, "projectChats")}
      </div>
    </div>
  )
}