import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/signIn.js';
import Register from './components/Register.js'; // Import Register component
import Dashboard from './components/Dashboard';
import Login from './components/Login.js';

const App = () => {
  const [user, setUser] = useState(null);
  const onLogin = (user) => {
    setUser(user); // This saves the logged-in user info (e.g., token)
    console.log('User logged in:', user); // Log the user data or token
  };
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Register />} /> {/* Add Register route */}
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
