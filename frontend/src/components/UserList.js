import React, { useState } from "react";
import "../CSS-files/UserList.css";
import { initialusers } from "../DummyData/userlist";
import UserListModal from "./UserListModal";

const UserList = () => {
  const [users, setUsers] = useState(initialusers);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Track the selected user ID

  const handleRemoveUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleViewProfile = (userId) => {
    console.log(`Viewing profile of user with ID: ${userId}`);
    setSelectedUserId(userId); // Set the selected user ID
    setShowUserListModal(true); // Show the modal
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: `New User ${users.length + 1}`,
      role: "Team Member",
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Team Members</h2>
      </div>
      <div className="users-container">
        {users.map((user) => (
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
                onClick={() => handleViewProfile(user.id)} // Fixed onClick handler
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
      <div className="add-user-container">
        <button className="add-user-button" onClick={handleAddUser}>
          Add New User
        </button>
      </div>

      {/* Render the modal outside the loop */}
      {showUserListModal && (
        <UserListModal
          onClose={() => setShowUserListModal(false)}
          userId={selectedUserId} // Pass the selected user ID to the modal
        />
      )}
    </div>
  );
};

export default UserList;