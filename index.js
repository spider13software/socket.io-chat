const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 3000;

const uri = 'mongodb://localhost/chatdb';
const client = new MongoClient(uri);

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const token = `${login}${password}`;
  res.json({
    success: true,
    login,
    token,
  });
});

const httpServer = http.Server(app);

const io = new socketIo.Server(httpServer, { /* options */ });

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

httpServer.listen(port);
