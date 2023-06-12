const { checkAuth } = require('../lib/express');
const { client, getUserList } = require('../lib/db');
const moment = require('moment');
const _ = require('lodash');

async function actionChat(req, res) {
  const chatId = req.params.chatId;
  const database = client.db('chatdb');
  const messages = database.collection('messages');

  const fullList = await getUserList();
  const list = fullList.filter(user => {
    return user.id !== req.session.userId;
  });

  const condition = {};
  if (chatId) {
    condition.$or = [
      {
        from: chatId,
        to: req.session.userId,
      },
      {
        from: req.session.userId,
        to: chatId,
      },
    ];
  } else {
    condition.to = null;
  }

  const msgList = (await messages.find(condition).toArray()).map(message => {
    const fromName = _.find(fullList, (user) => {
      return user.id === message.from;
    });
    return {
      time: moment(message.time || 0).format(),
      message: message.message,
      fromName: fromName.login || 'Unknown',
      to: null,
      from: null,
    };
  });

  res.render('chat', {
    users: list,
    messages: msgList,
    chatId,
  });
}

module.exports = function (app) {
  app.get('/chat', checkAuth, actionChat);
  app.get('/chat/:chatId', checkAuth, actionChat);
};
