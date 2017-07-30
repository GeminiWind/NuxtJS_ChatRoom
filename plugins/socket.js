var io = require('socket.io-client')

let options = {}
if (process.SERVER_BUILD) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
}
export default io.connect(options.baseURL)
