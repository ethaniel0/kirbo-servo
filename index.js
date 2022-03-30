const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

let connected = [false, false, false];

app.get('/', (req, res) => {
  res.send('/index.html')
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let accepted = false;
  let player = -1;
  socket.on('password', (password) => {
    console.log(password);
    if (password == 'kirbooooo'){
      console.log('entered kirbo')
      for (let i = 0; i < 3; i++){
        if (!connected[i]){
          console.log('connecting', i);
          accepted = true;
          connected[i] = true;
          player = i;
          socket.emit('accepted', '');
          break;
        }
      }
    }
  });

  socket.on('key', key => {
    if (accepted){
      socket.broadcast.emit('ctrl', (key << 2) + player);
    }
    console.log(key % 2);
    console.log((key << 1))
  })

  socket.on('disconnect', key => {
    connected[player] = false;
  });
  
});

server.listen(3000, () => {
  console.log('server started');
});
