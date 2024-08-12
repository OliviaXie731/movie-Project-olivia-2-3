const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const likeRouter = require('./routes/likeRoutes');
const axios = require('axios');
const webhookRouter = require('./webhook');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/like', likeRouter);
app.use('/webhook', webhookRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('chat message', async (msg) => {
    try {
      // 调用 Dialogflow API
      const response = await axios.post('https://6ef8af45e580a90384091ffbac288350.serveo.net', {
        queryInput: {
          text: {
            text: msg,
            languageCode: 'en',
          },
        },
      });

      const fulfillmentText = response.data.fulfillmentText;
      // 将 Dialogflow 的响应发送回客户端
      io.emit('chat message', `Bot: ${fulfillmentText}`);
    } catch (error) {
      console.error('Error calling Dialogflow API:', error);
      io.emit('chat message', 'Bot: Sorry, something went wrong.');
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }, 
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.log('errorObj', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
server.listen(port, () => {
  console.log(`App running on Port ${port}`);
});

module.exports = app;

