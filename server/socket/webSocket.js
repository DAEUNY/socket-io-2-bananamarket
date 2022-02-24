const webSocket = ({ chatTest, io }) => {
  return function socket(info) {
    io.on('connection', (socket) => {

      // socket.on
      // io.emit

    })
  }
}

module.exports = webSocket;