import React, { useState } from 'react';

function Chat({ socket, user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    socket.emit('sendMessage', { from: user.id, to: 'recipientId', message });
    setMessages((prev) => [...prev, { from: user.id, message }]);
    setMessage('');
  };

  socket.on('receiveMessage', (data) => {
    setMessages((prev) => [...prev, data]);
  });

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.from === user.id ? 'You' : 'Other'}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
