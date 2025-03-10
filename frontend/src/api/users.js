import { getAuthToken } from "../utils/token";
const API_URL = "http://localhost:5000";


export async function getUserProfile() {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}


export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function updateUserProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  try {
    const response = await fetch('http://localhost:5000/users/profile-picture', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update profile picture");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
}



export const getUsersInOrganization = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export async function changeUserPassword(newPassword) {
  try {
    const response = await fetch('http://localhost:5000/users/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Password: newPassword }),
    });
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}


export const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return "";
  
    if (typeof profilePicture === "string") {
      return profilePicture;
    }
  
    const { contentType, data } = profilePicture;
  
    if (typeof data === "string") {
      return `data:${contentType};base64,${data}`;
    }
  
    const byteArray = data && data.data ? data.data : data;
    if (!Array.isArray(byteArray)) {
      console.error("Expected an array of bytes but got:", byteArray);
      return "";
    }
  
    const binary = byteArray.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64String = window.btoa(binary);
    return `data:${contentType};base64,${base64String}`;
  };
  
  
