import axios from 'axios';

const URL = "http://localhost:5000/auth"

export const registerManager = async (managerData) => {
    const response = await axios.post(`${URL}/register-manager`, managerData);
    return response.data;
}

export const login = async (details) => {
    const response = await axios.post(`${URL}/login`, details);
    return response.data;
}

export const inviteEmployee = async (email) => {
    const response = await axios.post(`${URL}/invite-employee`, email);
    return response.data;
}

export const registerEmployee = async (employeeData) => {
    const response = await axios.post(`${URL}/register-employee`, employeeData);
    return response.data;
}

