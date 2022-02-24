// server.js

// var express = require('express');         // express 사용 
// var app = express();                      // express instance 생성
// var http = require('http').createServer(app);   // express instance에 http 사용
// const port = process.env.PORT || 3002;          
// var io = require('socket.io')(http);      // http로 socket instance 생성    
// var path = require('path');

module.exports = async (req, res) => {

  res.send('room');

  // console.log(server)

  // app.set('views', './views');
  // app.set('view engine', 'pug');
  // app.use(express.static(path.join(__dirname, 'public')));

  // 루트 페이지로 접속시 렌더링
  // app.get('/', (req, res) => {  
  //   res.send('chat');
  // });

  // var count=1;
  // io.on('connection', function(socket){ 
  //     console.log('user connected: ', socket.id);  
  //     var name = "익명" + count++;                 
  //   socket.name = name;
  //     io.to(socket.id).emit('create name', name);   
    
  //   socket.on('disconnect', function(){ 
  //     console.log('user disconnected: '+ socket.id + ' ' + socket.name);
  //   });

  //   socket.on('send message', function(name, text){ 
  //     var msg = name + ' : ' + text;
  //     socket.name = name;
  //       console.log(msg);
  //       io.emit('receive message', msg);
  //   });
    
  // });

  // http.listen(port, function(){ 
  //   console.log(`- - - - - - - - server on..${port} - - - - - - - - `);
  // });

};
