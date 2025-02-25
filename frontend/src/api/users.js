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