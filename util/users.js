const users = [];

const joinChat = (id, username) => {
  const user = { id, username };
  // if (users.find((user) => user.username === username)) {
  //   return;
  // }
  users.push(user);
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const leftChat = (id) => {
  return users.filter((user) => user.id !== id);
};

const getAllUsers = () => {
  return users;
};

module.exports = {
  joinChat,
  getCurrentUser,
  leftChat,
  getAllUsers,
};
