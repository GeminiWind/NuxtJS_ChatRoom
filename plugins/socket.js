var io = require('socket.io-client')

export default io.connect(process.env.serverUrl)
