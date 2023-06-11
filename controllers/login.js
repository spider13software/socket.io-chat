const client = require('../lib/db');

module.exports = function (app) {
  app.get('/login', async (req, res) => {
    res.render('login');
  });

  app.post('/login', async (req, res) => {
    const database = client.db('chatdb');
    const users = database.collection('users');

    const login = req.body.login;
    const password = req.body.password;
  
    const user = await users.findOne({
      login,
    });
  
    if (!user) {
      throw new Error('User not exists');
    }
  
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

  req.session.userId = user._id;

    res.redirect('/');
  });
};
