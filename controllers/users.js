const { client } = require('../lib/db');
const { ObjectId } = require('mongodb');
const { checkAuth } = require('../lib/express');

module.exports = function (app) {
  app.get('/users', checkAuth, async (req, res) => {
    const database = client.db('chatdb');
    const users = database.collection('users');

    const list = await users.find({}).toArray();

    res.render('users', {
      list,
    });
  });

  app.get('/users/delete/:id', checkAuth, async (req, res) => {
    const database = client.db('chatdb');
    const users = database.collection('users');

    const id = req.params.id;

    users.deleteOne({
      _id: new ObjectId(id),
    });

    res.redirect('/users');
  });

  app.get('/users/add', checkAuth, async (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;

    const database = client.db('chatdb');
    const users = database.collection('users');

    res.render('edit-user', {
      create: true,
      flash,
    });
  });

  app.post('/users/add', checkAuth, async (req, res) => {
    const database = client.db('chatdb');
    const users = database.collection('users');

    const email = req.body.email;
    const login = req.body.login;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      req.session.flash = 'Password not confirmed';
      res.redirect('/users/add');
      return false;
    }

    const user = await users.findOne({
      login,
    });

    if (user) {
      req.session.flash = 'User already exists';
      res.redirect('/users/add');
      return false;
    }

    await users.insertOne({
      email,
      login,
      password,
    });

    res.redirect('/users');

  });
};
