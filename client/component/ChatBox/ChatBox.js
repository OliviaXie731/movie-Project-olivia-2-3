import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatBox.css'; 

// const socket = io('http://localhost:3000');
const socket = io();

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', async (msg) => {
      if(msg.toLowerCase() === 'hi') {
        setMessages((prevMessages) => [...prevMessages, 'Bot: How can I help you?']);

      } else if(msg.toLowerCase() === 'hello') {
        setMessages((prevMessages) => [...prevMessages, 'Bot:886']);
      } else {
      // 当接收到消息时，调用 Dialogflow API
      try {
        const response = await axios.post('https://6ef8af45e580a90384091ffbac288350.serveo.net', {
          queryInput: {
            text: {
              text: msg,
              languageCode: 'en',
            },
          },
        });

        const fulfillmentText = response.data.fulfillmentText;
        setMessages((prevMessages) => [...prevMessages, `Bot: ${fulfillmentText}`]);
      } catch (error) {
        console.error('Error calling Dialogflow API:', error);
        setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, something went wrong.']);
      }   }
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      // 发送消息到 Socket.IO 服务器
      socket.emit('chat message', message);
      // 显示用户消息
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage('');
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;



