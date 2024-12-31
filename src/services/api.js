import axios from 'axios';
import { io } from 'socket.io-client';

// Define the backend URL (update it for your deployment)
export const API_URL = 'http://localhost:3001';

// Initialize the socket connection
export const socket = io(API_URL, {
  transports: ['websocket'],
  withCredentials: true,
});
export const register = async (email, username, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, username, password });
    
    return response.data;
  };
  
  // You can also include other functions like login, fetchConnectionRequests, etc.

// API calls
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const sendConnectionRequest = async (fromUserId, toUserId) => {
  const response = await axios.post(`${API_URL}/chat/request`, { fromUserId, toUserId });
  return response.data;
};

export const fetchConnectionRequests = async (userId) => {
  const response = await axios.get(`${API_URL}/chat/requests/${userId}`);
  return response.data;
};

export const respondToConnectionRequest = async (requestId, status) => {
  const response = await axios.post(`${API_URL}/chat/respond`, { requestId, status });
  return response.data;
};
