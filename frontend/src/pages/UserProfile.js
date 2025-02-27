import Sidebar from "../components/sidebar";
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import {
  getUserProfile,
  updateUserProfilePicture,
  changeUserPassword,
} from "../api/users.js";

const UserProfile = ({}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdatePicture = async () => {
    if (!selectedFile) return;
    try {
      const updatedUser = await updateUserProfilePicture(selectedFile);
      setUser(updatedUser);
      setShowPopup(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await changeUserPassword(newPassword);
      // Optionally, you can also fetch the updated user profile if needed:
      // const updatedProfile = await getUserProfile();
      // setUser(updatedProfile);
      setShowPopup(null);
      // Clear password fields:
      setNewPassword("");
      setConfirmNewPassword("");
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <NavBar />
      </header>
    {/* Main content */}
   <div className="flex flex-1 overflow-hidden">
    <Sidebar isMinimized={!isMinimized} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 h-full justify-center p-6 overflow-y-auto">
          <div className="flex flex-col h-min bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-3xl font-semibold text-center">My Profile</h2>
            <div className="flex flex-col items-center w-full p-5">
            <img
              src={user.profilePicture} 
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-indigo-500"
            />  
              <button
                className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                onClick={() => setShowPopup("profilePicture")}
              >
                Change Picture
              </button>
            </div>
            <div className="mb-6 flex flex-col">
              <h3 className="text-lg text-start font-semibold p-2 pl-0">
                Name
              </h3>
              <div className="flex flex-row gap-4 rounded-lg w-full">
                <input
                  type="text"
                  className="border flex text-gray-700 mt-3 p-2 rounded-lg w-full"
                  value={user.firstName}
                  readOnly
                />
                <input
                  type="text"
                  className="border flex text-gray-700 mt-3 p-2 rounded-lg w-full"
                  value={user.lastName}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-6 flex flex-col">
              <h3 className="font-semibold text-lg text-start p-2 pl-0">
                Email
              </h3>
              <div className="flex flex-row items-center space-x-6 gap-6 rounded-lg w-full">
                <input
                  type="text"
                  className="border flex flex-1 w-full text-gray-700 mt-3 p-2 rounded-lg"
                  value={user.email}
                  readOnly
                />
                <button
                  className="mt-3 bg-indigo-500 py-2 text-white px-4 rounded-lg shadow-md hover:bg-indigo-600"
                  onClick={() => setShowPopup("email")}
                >
                  Change Email
                </button>
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <h3 className="font-semibold text-lg text-start p-2 pl-0">
                Password
              </h3>
              <div className="flex flex-row gap-6 rounded-lg w-full">
                <input
                  type="password"
                  className="border flex flex-1 w-full text-gray-700 mt-3 p-2 rounded-lg"
                  value="not-that-easy"
                  readOnly
                />
                <button
                  className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                  onClick={() => setShowPopup("password")}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              {showPopup === "profilePicture" ? (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Change Profile Picture
                  </h3>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                      onClick={() => setShowPopup(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                      onClick={handleUpdatePicture}
                    >
                      Update
                    </button>
                  </div>
                </>
              ) : showPopup === "email" ? (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Change Email
                  </h3>
                  <input
                    type="email"
                    placeholder="New Email"
                    className="border p-2 rounded w-full mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                      onClick={() => setShowPopup(null)}
                    >
                      Cancel
                    </button>
                    <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                      Update
                    </button>
                  </div>
                </>
              ) : showPopup === "password" ? (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Change Password
                  </h3>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 rounded w-full mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="border p-2 rounded w-full mb-4"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                      onClick={() => setShowPopup(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                      onClick={handleUpdatePassword}
                    >
                      Update
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
