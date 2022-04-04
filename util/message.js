const moment = require('moment');

const messageFormat = (username, txt) => {
  return {
    username,
    txt,
    time: moment().format('h:mm a'),
  };
};

module.exports = messageFormat;
