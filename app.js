const express = require('express');
const messageFormat = require('./util/message');
const {
  joinChat,
  getCurrentUser,
  leftChat,
  getAllUsers,
} = require('./util/users');

const path = require('path');

const app = express();

const PORT = 3000 || process.env.PORT;

// Set the static file
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`server is connected to port ${PORT}`);
});

const io = require('socket.io')(server);

const bot = 'TalkBox bot';
let num = 1;

//Run when client is connected
io.on('connection', (socket) => {
  console.log('New ws connection is made');

  socket.on('joinChat', ({ username }) => {
    //Welcome current user
    socket.emit('message', messageFormat(bot, `Welome to TalkBox chat app`));

    //Broad cast when someone with same user name appears
    if (
      getAllUsers().length > 0 &&
      getAllUsers().some((user) => user.username === username)
    ) {
      // Join the Chat
      username = username + ' ' + num;
      console.log(username);
      joinChat(socket.id, username);

      // Broadcast when user connects
      socket.broadcast.emit(
        'message',
        messageFormat(username, `${username} has joined the chat`)
      );
      socket.emit(
        'inform',
        messageFormat(
          username,
          `Username you entered already exists so we made some modification to your username, so the other user won't get confused`
        )
      );
      num++;
    } else {
      // Join the Chat
      joinChat(socket.id, username);

      socket.broadcast.emit(
        'message',
        messageFormat(username, `${username} is join the chat`)
      );
    }

    // Current user Chat Message
    socket.on('chatMsg', (msg) => {
      const user = getCurrentUser(socket.id);
      io.emit('message', messageFormat(user.username, msg));
    });

    // Send all users currently in chat
    const users = getAllUsers();
    io.emit('getAllUsers', users);

    // When user disconnect
    socket.on('disconnect', () => {
      const user = leftChat(socket.id);
      io.emit('message', messageFormat(bot, `${username} has left the chat`));
    });
  });
});
