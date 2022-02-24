const express = require("express");
const app = express();
const server = require('http').createServer(app)    // 🍎
const indexRouter = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 3001;                              // 소켓 통신 용도의 포트 별도 필요 🍎 // 웹소켓 데이터 주고 받는 이미지 // 포트 다르게 동작
// const models = require("./models/index.js");
const { sequelize } = require("./models/index.js");
require("dotenv").config();
{
// connection test
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log(' 😈 Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error(' 👿 Unable to connect to the database:', err);
//   });

// sequelize
//   .sync()
//   .then(()=> {
//     console.log('🤢 re-sync db.')
//   })
//   .catch(err => {
//     console.log('🤮 re-sync error: ', err)
//   })
}

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

// app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.send(`🍌 ~~ Banana Market ~~ 🍌`);
});

server.listen(port, () => {
  console.log(`🍌 ~~ Banana Market 서버가 작동 중입니다 ~~ 🍌`);
});

//  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎
  { 
//     // // socket.io
//     // // const io = require('socket.io')(server)
//     // const socketIo = require('socket.io')
//     // const io = socketIo(server, {
//     //   cors: {
//     //     origin: '*',
//     //     credentials: true,
//     //     // methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
//     //   }
//     // })

//     // // const { Chats, Article, User, UserArticles } = require('./models');

//     // io
//     // .on('connection', (socket) => {
//     //   // console.log('User connected', socket.id);

//     //   // ~85번 함수로 만들어서(파일에서 import) 여기서 사용 🍎
//     //   // function onConnection(socket){...
//     //   io.emit('channel', 'hello??')

//     //   socket
//     //   .on('channel', (data) => {
//     //     if (!data) return;
//     //     console.log('Client says', data)
//     //     // socket.join(data.Room);
//     //     // io.to(data.Room).emit('channel', `${data}`)

//     //     socket
//     //     .on('join', (key) => {
//     //       socket.join(key);
//     //     })

//     //     socket
//     //     .on("channel", ({ name, message }) => {
//     //       io
//     //       .emit("channel", { name, message });
//     //     });


//     //   })
//     // })

//     // // module.exports = { io };
//     // app.set('io', io);

} 

// const { Server } = require('socket.io');
// const io = new Server(server, {
const { Server } = require('socket.io');
const io = new Server(server, {
  allowEIO3: true, // false by default
  cors : {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
// const { Server } = require("http");

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    console.log('= = = socket 연결!!= = = ')

    const { error, user } = addUser({ id: socket.id, name, room });
    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

app.set('io', io);


//  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎  🍎   🍎   🍎





// server.listen(port, () => {
//   console.log(`🍌 ~~ Banana Market 서버가 작동 중입니다 ~~ 🍌`);
// });

// module.exports = app;












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
