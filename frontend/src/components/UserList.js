import React, { useState } from "react";
import "../CSS-files/UserList.css";
import { initialusers } from "../DummyData/userlist";
import UserListModal from "./UserListModal";
import AddMemberModal from "./AddMemberModal"; 

const UserList = () => {
  const [users, setUsers] = useState(initialusers);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleViewProfile = (userId) => {
    console.log(`Viewing profile of user with ID: ${userId}`);
    setSelectedUserId(userId);
    setShowUserListModal(true);
  };

  const handleAddUser = () => {
    setShowAddMemberModal(true);
  };

  const handleAddMember = (email) => {
    const newUser = {
      id: users.length + 1,
      name: email, 
    };
    setUsers([...users, newUser]);
    setShowAddMemberModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Team Members</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button className="add-member-button" onClick={handleAddUser}>
            Add Member
          </button>
        </div>
      </div>
      <div className="users-container">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <div className="avatar"></div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role}</p>
              </div>
            </div>
            <div className="user-actions">
              <button
                className="action-button view-profile"
                onClick={() => handleViewProfile(user.id)}
              >
                View
              </button>
              <button
                className="action-button remove-user"
                onClick={() => handleRemoveUser(user.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UserListModal for viewing profiles */}
      {showUserListModal && (
        <UserListModal
          onClose={() => setShowUserListModal(false)}
          userId={selectedUserId}
        />
      )}

      {/* AddMemberModal for adding new members */}
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}
    </div>
  );
};

export default UserList;