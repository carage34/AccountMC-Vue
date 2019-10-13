/*
Import lib
*/
var express = require('express')
var app = express()
var path = require('path')
var session = require('express-session')
var server = require('http').Server(app)
var io = require('socket.io')(server)
var mcp = require('minecraft-protocol')
var cors = require('cors')
var morgan = require('morgan')

require('custom-env').env(true)

var crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)
var bodyParser = require('body-parser')
var flash = require('express-flash-messages')
var fs = require('fs')
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
var login = {}
// Get database conf

app.use(flash())

console.log(process.env.DB_HOST)
// Database configuration
var mysql = require('mysql')
connection = require('express-myconnection')
config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
}

// DB connection
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: false,
  resave: false
}))
app.use(connection(mysql, config, 'request'))

var index = require('./routes/index')
var users = require('./routes/users')

app.use('/', index)
app.use('/users', users)
app.use(express.static('public'))

app.get('/api', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
  res.json({ status: 'Working' })
})

exports.addUser = function (id, session) {
  login[id] = session
}

exports.getUser = function (id) {
  return login[id]
}

module.exports = app

var minecraftaccount = require('./minecraftaccount.js')(io)
console.log('Server running on port ' + process.env.PORT)
server.listen(process.env.PORT)
