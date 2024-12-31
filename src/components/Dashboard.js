import React, { useState, useEffect } from 'react';
import { API_URL, socket } from '../services/api.js';
import axios from 'axios';
import Notification from './Notification';
import Chat from './Chat';

const Dashboard = ({ user }) => {
  const [connections, setConnections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [users, setUsers] = useState([]); // State for all users fetched based on the search query

  // Listen for new connection requests
  useEffect(() => {
    console.log('Socket connected:', socket.id); // Check if socket is connected
  
    socket.on('newConnectionRequest', (data) => {
      console.log('Received connection request:', data); // Log the received data
      setNotifications((prev) => [...prev, data]); // Update state with new notification
    });
  
    return () => {
      socket.off('newConnectionRequest'); // Cleanup listener on unmount
    };
  }, []);
  

  // Fetch user's connections and join the socket room
  useEffect(() => {
    socket.emit('join', user.id); // Join the socket room using the user ID

    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/connections`, {
          params: { userId: user.id },
        });
        setConnections(response.data);
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };

    fetchConnections();
  }, [user]);

  // Search for users based on query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query
  };

  // Fetch users that match the search query
  const searchUsers = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(`${API_URL}/auth/search`, {
          params: { username: searchQuery },
        });
        setUsers(response.data); // Set the users that match the search query
      } catch (err) {
        console.error('Error searching users:', err);
      }
    } else {
      setUsers([]); // Reset the search results if query is empty
    }
  };

  // Send a connection request to a user
  const sendConnectionRequest = (recipientId) => {
    console.log(`Sending connection request from ${user.id} to ${recipientId}`);
    socket.emit('sendConnectionRequest', { fromUserId: user.id, toUserId: recipientId });
  };

  // Open a chat window for the selected connection
  const openChat = (connection) => {
    setSelectedChat(connection);
  };

  // Close the chat window
  const closeChat = () => {
    setSelectedChat(null);
  };

  if (selectedChat) {
    return (
      <Chat
        user={user}
        connection={selectedChat}
        onClose={closeChat}
      />
    );
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>

      <Notification notifications={notifications} />

      {/* Search Section */}
      <div className="search">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search users by username"
        />
        <button onClick={searchUsers}>Search</button>
      </div>

      {/* Display search results */}
      {searchQuery && (
        <div className="search-results">
          <h3>Search Results</h3>
          <ul>
            {users.length > 0 ? (
              users.map((userItem) => (
                // console.log(userItem._id),
                <li key={userItem._id}>
                  {userItem.username}
                  <button onClick={() => sendConnectionRequest(userItem._id)}>
                    Send Request
                  </button>
                </li>
              ))
            ) : (
              <p>No users found</p>
            )}
          </ul>
        </div>
      )}

      {/* Connections List */}
      <div className="connections">
        <h3>Your Connections</h3>
        <ul>
          {connections.map((connection) => (
            <li key={connection.id}>
              {connection.username}
              <button onClick={() => openChat(connection)}>Chat</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
