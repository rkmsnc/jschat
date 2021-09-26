const cors = require('cors')
const http = require('http')
const https = require('https')
const WebSocket = require('ws')
const express = require('express')
const fs = require('fs')
const webPort = 5000
const appExpress = express()
const isHttps = false
const hostname = '192.168.65.130'
// const hostname = 'localhost'

const privateKey = fs.readFileSync('key.pem', 'utf8')
const certificate = fs.readFileSync('cert.pem', 'utf8')
// const privateKey = fs.readFileSync('key.key', 'utf8')
// const certificate = fs.readFileSync('cert.cert', 'utf8')

const credentials = { key: privateKey, cert: certificate }
const httpServer = isHttps ? https.createServer(credentials, appExpress) : http.createServer(appExpress)
const wsServer = new WebSocket.Server({ server: httpServer })
appExpress.use(cors())
appExpress.use(express.static('public'))
appExpress.use(express.json({ limit: '50mb' }))

wsServer.on('connection', function connection (ws) {
  console.log('Connection Established : ', ws._socket.server._connections)
  ws.on('message', function (buf) {
    console.log(buf.toString('utf8'))
  })
  ws.on('close', function (code, reason) {
    console.log(`Client disconnected (${code}) with message : ${reason} \n`)
  })
})

wsServer.on('open',function(e) {
    console.log(e)
})

const sendDataToClients = function (data) {
  wsServer.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

appExpress.post('/', function (req, res) {
  console.log(req.body)
  sendDataToClients(req.body)
  res.end(JSON.stringify({
    status: 'SUCCESS'
  }))
})

appExpress.listen(8000, hostname, function () {
  console.log('Server listening on port 8000 !')
})

httpServer.listen(process.env.PORT || webPort, hostname, function () {
  console.log('Websocket Server on \n', httpServer.address())
})
