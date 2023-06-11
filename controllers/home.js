const { checkAuth } = require('../lib/express');

module.exports = function (app) {
  app.get('/', checkAuth, (req, res) => {
    res.render('home');
  });
};
