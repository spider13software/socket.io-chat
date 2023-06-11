const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { glob } = require('glob');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const initDemoData = require('./lib/demo-data');

const port = process.env.PORT || 3000;

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
  app.use(sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized:true,
      cookie: { maxAge: oneDay },
      resave: false 
  }));

  const controllers = await glob(`${__dirname}/controllers/*.js`);
  for (let index = 0; index < controllers.length; index++) {
    require(controllers[index])(app);
  }
  
  const httpServer = http.Server(app);
  
  const io = new socketIo.Server(httpServer, { /* options */ });
  
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', `${socket.token}: ${msg}`);
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

