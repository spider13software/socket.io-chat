const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index');
});

const httpServer = http.Server(app);

const io = new socketIo.Server(httpServer, { /* options */ });

httpServer.listen(port);
