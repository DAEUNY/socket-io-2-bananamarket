const express = require("express");
const app = express();
const httpServer = require('http').createServer(app)    // 🍎
const indexRouter = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 3001;                              // 소켓 통신 용도의 포트 별도 필요 🍎 // 웹소켓 데이터 주고 받는 이미지 // 포트 다르게 동작
// const models = require("./models/index.js");
const { sequelize } = require("./models/index.js");
require("dotenv").config();

// connection test
sequelize
  .authenticate()
  .then(() => {
    console.log(' 😈 Connection has been established successfully.');
  })
  .catch(err => {
    console.error(' 👿 Unable to connect to the database:', err);
  });

// sequelize
//   .sync()
//   .then(()=> {
//     console.log('🤢 re-sync db.')
//   })
//   .catch(err => {
//     console.log('🤮 re-sync error: ', err)
//   })

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  })
);



//  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎
  // { 
    // socket.io
    // const io = require('socket.io')(httpServer)
    const socketIo = require('socket.io')
    const io = socketIo(httpServer, {
      cors: {
        origin: '*',
        credentials: true,
        // methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
      }
    })

    // const { Chats, Article, User, UserArticles } = require('./models');

    io
    .on('connection', (socket) => {
      // console.log('User connected', socket.id);

      // ~85번 함수로 만들어서(파일에서 import) 여기서 사용 🍎
      // function onConnection(socket){...
      io.emit('channel', 'hello??')

      socket
      .on('channel', (data) => {
        if (!data) return;
        console.log('Client says', data)
        // socket.join(data.Room);
        // io.to(data.Room).emit('channel', `${data}`)

        socket
        .on('join', (key) => {
          socket.join(key);
        })

        socket
        .on("channel", ({ name, message }) => {
          io
          .emit("channel", { name, message });
        });


      })
    })

    // module.exports = { io };
    app.set('io', io);

// } 
//  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎



app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.send(`🍌 ~~ Banana Market ~~ 🍌`);
});

// const { webSockets } = require('./socket/chat-test');
// webSockets()

app.listen(port, () => {
  console.log(`🍌 ~~ Banana Market 서버가 작동 중입니다 ~~ 🍌`);
});

module.exports = app;












// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require('socket.io');
// const io = new Server(server);

// // app.get('/', (req, res) => {
// //   res.sendFile(__dirname + '/index.html');
// // });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// })

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });
