const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { glob } = require('glob');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const initDemoData = require('./lib/demo-data');
const sharedsession = require('express-socket.io-session');
const client = require('./lib/db');
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 3001;

async function main() {
  await initDemoData();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true,
  }));

  app.set('view engine', 'ejs');
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  
  app.use(cookieParser());

  const oneDay = 1000 * 60 * 60 * 24;

  const sessionManager = sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  });

  app.use(sessionManager);

  const controllers = await glob(`${__dirname}/controllers/*.js`);
  for (let index = 0; index < controllers.length; index++) {
    require(controllers[index])(app);
  }
  
  const httpServer = http.Server(app);
  
  const io = new socketIo.Server(httpServer, { /* options */ });
  
  io.use(sharedsession(sessionManager, {
    autoSave: true
  })); 

  io.on('connection', (socket) => {
    const session = socket.request.session;

    socket.on('chat message', async (msg) => {
      if (socket.handshake.session.userId) {
        const userId = socket.handshake.session.userId;
        const database = client.db('chatdb');
        const users = database.collection('users');
        const messages = database.collection('messages');
        const user = await users.findOne({
          _id: new ObjectId(userId),
        });
        const { message, to } = msg;
        await messages.insertOne({
          message,
          from: userId,
          to,
          time: +(new Date()),
        });
        io.emit('chat message', {
          from: userId,
          fromName: user.login,
          to,
          message,
        });
      }
    });
  
    socket.on('login', (msg) => {
      socket.token = msg.token;
    });
  });

  httpServer.listen(port);
  console.log(`Server statred on http://localhost:${port}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

