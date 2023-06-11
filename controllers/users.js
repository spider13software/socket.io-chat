const client = require('../lib/db');
const { checkAuth } = require('../lib/express');

module.exports = function (app) {
  app.get('/users', checkAuth, (req, res) => {
    res.render('users');
  });
};
