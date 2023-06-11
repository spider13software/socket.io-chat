const { checkAuth } = require('../lib/express');
const client = require('../lib/db');

async function actionChat(req, res) {
  const chatId = req.params.chatId;
  const database = client.db('chatdb');
  const users = database.collection('users');

  let list = await users.find({}).toArray();
  list = list.filter(user => {
    return user._id.toString() !== req.session.userId;
  });

  res.render('chat', {
    users: list,
    chatId,
  });
}

module.exports = function (app) {
  app.get('/chat', checkAuth, actionChat);
  app.get('/chat/:chatId', checkAuth, actionChat);
};
