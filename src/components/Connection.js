import React from 'react';
import { respondToConnectionRequest } from '../services/api';

function ConnectionRequestList({ requests, user }) {
  const handleResponse = async (requestId, status) => {
    await respondToConnectionRequest(requestId, status);
    alert(`Request ${status}`);
  };

  return (
    <div>
      <h3>Connection Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            {request.from.username} wants to connect.
            <button onClick={() => handleResponse(request._id, 'accepted')}>Accept</button>
            <button onClick={() => handleResponse(request._id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConnectionRequestList;
