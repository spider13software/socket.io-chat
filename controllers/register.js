const { client } = require('../lib/db');

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'password';

async function registerUser(login, password) {
  const database = client.db('chatdb');
  const users = database.collection('users');

  const user = await users.findOne({
    login: ADMIN_LOGIN,
  });

  if (user) {
    throw new Error('User already exists');
  }

  await users.insertOne({
    login,
    password,
  });
}

module.exports = function (app) {
  app.post('/register', async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
  
    res.json({
      success: true,
      login,
      token,
    });
  });
};
