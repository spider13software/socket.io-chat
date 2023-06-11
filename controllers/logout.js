const client = require('../lib/db');

module.exports = function (app) {
  app.get('/logout', async (req, res) => {
    delete req.session.userId;
    res.redirect('/login');
  });
};
