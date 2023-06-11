const { checkAuth } = require('../lib/express');
const client = require('../lib/db');

module.exports = function (app) {
  app.get('/chat', checkAuth, (req, res) => {
    res.render('chat');
  });
};
