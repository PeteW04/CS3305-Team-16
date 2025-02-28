import { useState } from "react";
import { createChannel } from "../api/channel";
import { getUsersInOrganization } from "../api/users";
import { Plus, Users, Briefcase, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import "../CSS-files/MessageList.css";

export default function ChatList({ onChatSelect, chatData, onNewChat }) {
  const [activeChat, setActiveChat] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    directMessages: true,
    groupChats: true,
    projectChats: true,
  });
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = async () => {
    setIsModalOpen(true);
    try {
      const fetchedUsers = await getUsersInOrganization();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleCreateChat = async (chatDetails) => {
    try {
      const newChat = await createChannel(chatDetails);
      setIsModalOpen(false);
      onNewChat(newChat);
    } catch (error) {
      console.error("Error creating chat:", error.message);
    }
  };

  const handleChatClick = (chat) => {
    setActiveChat(chat._id);
    onChatSelect(chat);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderChatItem = (chat) => {
    const latestMessage = chat.latestMessage;
    const unreadCount = chat.unreadCount || 0; // Use chat.unreadCount directly

    return (
      <div
        key={chat._id}
        className={`chat-item ${activeChat === chat._id ? "active" : ""}`}
        onClick={() => handleChatClick(chat)}
      >
        <div className="chat-item-content">
          <div className="chat-item-header">
            <span className="chat-item-name">{chat.name}</span>
            {unreadCount > 0 && (
              <span className="chat-item-badge">{unreadCount}</span>
            )}
            {latestMessage && (
              <span className="chat-item-time">
                {new Date(latestMessage.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
          <p className="chat-item-message">
            {latestMessage
              ? `${latestMessage.senderId?.firstName || 'Unknown user'}: ${latestMessage.text}`
              : "No messages yet"}
          </p>
        </div>
      </div>
    );
  };


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
    <>
      <div className="chat-list">
        <div className="chat-list-header">
          <button className="new-chat-button" onClick={openModal}>
            <Plus size={16} />
            <span>Add New Chat</span>
          </button>
        </div>

        {renderChatSection("Direct Messages", <MessageSquare size={16} />, chatData.filter(c => c.type === 'direct-message'), "directMessages")}
        {renderChatSection("Group Chats", <Users size={16} />, chatData.filter(c => c.type === 'group'), "groupChats")}
        {renderChatSection("Project Chats", <Briefcase size={16} />, chatData.filter(c => c.type === 'project'), "projectChats")}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Chat</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const type = e.target.type.value;
                const name = e.target.name.value;
                const selectedMembers = Array.from(e.target.members)
                  .filter((option) => option.selected)
                  .map((option) => option.value); // Collect selected user IDs
                handleCreateChat({ type, name, members: selectedMembers });
              }}
            >
              <label className="block mb-2 font-medium text-gray-700">
                Chat Type:
                <select
                  name="type"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="direct-message">Direct Message</option>
                  <option value="group">Group</option>
                  <option value="project">Project</option>
                </select>
              </label>

              <label className="block mb-2 font-medium text-gray-700">
                Chat Name:
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter chat name"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>

              <label className="block mb-2 font-medium text-gray-700">
                Members:
                <select
                  name="members"
                  multiple
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>

  );
}
