import Sidebar from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfilePicture, changeUserPassword } from "../api/users.js";

const UserProfile = ({  }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
    <div className="bg-gray-100 pt-16 flex">
      <Sidebar />
      <div className="w-full p-6 overflow-auto h-screen">
        <div className="grid grid-cols-6 w-full max-w-1xl bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-3xl font-semibold mb-6 text-center col-span-6">
            My Profile
          </h2>
          <div className="col-span-2 flex flex-col items-center p-10 mb-6 bg-gray-200 shadow-lg rounded-lg ">
            <img
              src={`http://localhost:5000/${user.profilePicture}`}
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-indigo-500"
            />
            <button
              className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
              onClick={() => setShowPopup("profilePicture")}
            >
              Change Picture
            </button>
          </div>
          <div className="col-start-1 col-span-2 mb-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-center p-4">Name</h3>
            <div className="bg-gray-200 rounded-lg w-full">
              <p className="text-gray-700 p-2 bg-gray-200 rounded-lg w-full">
                {user.firstName}
              </p>
              <p className="text-gray-700 mt-3 p-2 bg-gray-200 rounded-lg w-full">
                {user.lastName}
              </p>
            </div>
          </div>
          <div className="bg-gray-200 grid grid-cols-2 w-full col-start-4 col-span-3 row-start-2 row-end-4 rounded-lg shadow-lg">
            <div className="col-start-1 col-span-2 row-start-2 flex flex-col mb-6 items-center justify-center">
              <h3 className="text-lg font-semibold text-center p-4">Email</h3>
              <p className="text-gray-700 text-center">{user.email}</p>
              <button
                className="mt-3 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                onClick={() => setShowPopup("email")}
              >
                Change Email
              </button>
            </div>
            <div className="col-start-1 col-span-2 row-start-3 flex flex-col mb-6 items-center">
              <h3 className="text-lg font-semibold text-center p-4">
                Password
              </h3>
              <button
                className="mt-3 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600"
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
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
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
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
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
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
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
  );
};

export default UserProfile;
