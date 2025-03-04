import React, { useState, useEffect } from "react";
import "../CSS-files/UserList.css";
import { inviteEmployee } from "../api/manager";
import { deleteUser, getUsersInOrganization, getProfilePictureUrl } from "../api/users";
import UserListModal from "./UserListModal";
import AddMemberModal from "./AddMemberModal";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersInOrganization();
        setUsers(users);

      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddMember = async (email) => {
    try {
      await inviteEmployee({ email });
    } catch (err) {
      console.error("Add member error:", err);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleRemoveUser = async (userId) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Remove user error:", err);
    }
  }

  const handleViewProfile = (userId) => {
    console.log(`Viewing profile of user with ID: ${userId}`);
    setSelectedUserId(userId);
    setShowUserListModal(true);
    console.log('Modal state after click:', showUserListModal);
  };

  const handleAddUser = () => {
    setShowAddMemberModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName?.toLowerCase()} ${user.lastName?.toLowerCase()}`;
    return fullName.includes(searchQuery.toLowerCase());
  });





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
          <div key={user._id} className="user-item">
            <div className="user-info">
            <div className="avatar">
                {user.profilePicture ? (
                  <img
                    src={getProfilePictureUrl(user.profilePicture)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="user-avatar"
                  />
                ) : (
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="User avatar"
                    className="user-avatar"
                  />
                )}
              </div>
              <div className="user-details">
                <p className="user-name">{`${user.firstName} ${user.lastName}`}</p>
                <p className="user-role">{user.role}</p>
              </div>
            </div>
            <div className="user-actions">
              <button
                className="action-button view-profile"
                onClick={() => handleViewProfile(user._id)}
              >
                View
              </button>
              <button
                className="action-button remove-user"
                onClick={() => handleRemoveUser(user._id)}
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