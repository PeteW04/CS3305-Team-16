const API_URL = "http://localhost:5000/user";

export const inviteEmployee = async (inviteData) => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_URL}/invite-employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(inviteData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to invite employee");
        }

        return await response.json();
    } catch (error) {
        console.error("Error inviting employee:", error.message);
        throw error;
    }
};
