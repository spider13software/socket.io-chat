const { checkAuth } = require('../lib/express');
const client = require('../lib/db');

async function actionChat(req, res) {
  const chatId = req.params.chatId;
  const database = client.db('chatdb');
  const users = database.collection('users');
  const messages = database.collection('messages');

  let list = await users.find({}).toArray();
  list = list.filter(user => {
    return user._id.toString() !== req.session.userId;
  });

  const condition = {};
  if (chatId) {
    const msgList = await messages.find(condition).toArray();
    condition.from = chatId;
    condition.to = req.sessiom.userId;
  } else {
    condition.to = null;
  }

  const msgList = await messages.find(condition).toArray();

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
