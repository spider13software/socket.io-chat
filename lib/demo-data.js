const { client } = require('../lib/db');
const { ObjectId } = require('mongodb');

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'admin';

module.exports = async  function initDemoData() {
  const database = client.db('chatdb');
  const users = database.collection('users');

  const user = await users.findOne({
    login: ADMIN_LOGIN,
  });

  if (user) {
    if (user.password !== ADMIN_PASSWORD) {
      await users.updateMany({ 
        _id: new ObjectId(user._id),
      }, {
        $set: { password: ADMIN_PASSWORD, }
      });
    }
  } else {
    await users.insertOne({
      login: ADMIN_LOGIN,
      password: ADMIN_PASSWORD,
    });
  }
};
