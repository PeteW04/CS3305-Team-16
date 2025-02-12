const API_URL = "http://localhost:5000/api";

export const getOrganizationDetails = async (organizationId) => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_URL}/organization/${organizationId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch organization details");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching organization details:", error.message);
        throw error;
    }
};
