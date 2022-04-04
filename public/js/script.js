const messageForm = document.querySelector('.chat-form');
const chatmsg = document.querySelector('.chat-container');
const usersList = document.querySelector('.users');

const socket = io();

// const Qs = qs;

// const { username } = Qs.parse(window.location.search, {
//   ignoreQueryPrefix: true,
// });

const params = new URLSearchParams(window.location.search);
const [username] = params.getAll('username');
console.log(username);

if (username) {
  socket.emit('joinChat', { username });
}

const outputUsers = (users) => {
  usersList.innerHTML = `${users
    .map(
      (user) =>
        `<li class="user"><i class="fa-solid fa-user user-icon"></i>${user.username}</li>`
    )
    .join('')}`;
};

const showChatMessage = (message) => {
  const html = `
  <div class="chat-msg">
    <p>${message.username}</p>
    <div class="msg">
      <p style="width:90%">${message.txt}</p>
      <p >${message.time}</p>
    </div>
  </div>
  `;
  document
    .querySelector('.chat-container')
    .insertAdjacentHTML('beforeend', html);
};

// Get all users
socket.on('getAllUsers', (users) => {
  outputUsers(users);
  // check(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  showChatMessage(message);
  chatmsg.scrollTop = chatmsg.scrollHeight;
});

// Inform the current user who's username is same as the other one
socket.on('inform', (message) => {
  showChatMessage(message);
});

if (messageForm) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.querySelector('.message').value;
    socket.emit('chatMsg', message);
    document.querySelector('.message').value = '';
  });
}
