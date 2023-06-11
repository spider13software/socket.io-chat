const client = require('../lib/db');

module.exports = function (app) {
  app.get('/login', async (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;

    res.render('login', {
      flash,
    });
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
      req.session.flash = 'User not exists';
      res.redirect('/login');
      return false;
    }
  
    if (user.password !== password) {
      req.session.flash = 'Invalid password';
      res.redirect('/login');
      return false;
    }

    req.session.userId = user._id;

    res.redirect('/');
  });
};
