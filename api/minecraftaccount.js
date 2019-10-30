var fs = require('fs')
var request = require('request')
var mcp = require('minecraft-protocol')
var crypt = require('./crypt.js')
var socket = require('socket.io')
var contaccount = require('./controller/account.js')
const accounts = {}
var group = {}
var ios = null

function updateAccount () {
  return new Promise((resolve, reject) => {
    contaccount.getAccounts().then(function (result) {
      result.forEach(function (element, index) {
        if (typeof accounts[element.id] === 'undefined') {
          console.log('ok')
          element.connected = false
          element.load = false
          accounts[element.id] = element
        } else {
          var tmp = accounts[element.id]
          element.connected = tmp.connected
          element.load = tmp.load
          if (typeof tmp.client !== 'undefined') {
            element.client = tmp.client
          }
          accounts[element.id] = element
        }
        resolve(accounts)
      })
    }).catch(function (err) {
      console.log('Error promise update account : ' + err)
    })
  }).catch(function (error) {
    if (error) throw error
  })
}

function updateGroup () {
  group = {}
  return new Promise((resolve, reject) => {
    contaccount.getGroups().then(function (resultt) {
      resultt.forEach(function (element, index) {
        if (typeof group[element.groupName] === 'undefined') {
          group[element.groupName] = {}
          group[element.groupName][element.id] = element
        } else {
          group[element.groupName][element.id] = element
        }
      })
      resolve(group)
      /* obj.forEach(function(element, index) {
        console.log(element);
        }) */
    }).catch(function (err) {
      console.log(err)
    })
  })
}

/* process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err)
  // ios.emit("error", err);
})  */

module.exports = function (io) {
  ios = io
  contaccount.getAccounts().then(function (result) {
    result.forEach(function (element, index) {
      element.connected = false
      element.load = false
      accounts[element.id] = element
    })
  }).catch(function (err) {
    console.log('Error promise getAccount : ' + err)
  })
  contaccount.getGroups().then(function (resultt) {
    resultt.forEach(function (element, index) {
      //  console.log(element)
      if (typeof group[element.groupName] === 'undefined') {
        group[element.groupName] = {}
        group[element.groupName][element.id] = element
      } else {
        group[element.groupName][element.id] = element
      }
    })
    console.log(group)
    //  group = []
    //  group.push(obj)
  }).catch(function (err) {
    console.log(err)
  })
  init()
}

function init () {
  // console.log(accounts);
  ios.sockets.on('connection', function (socket) {
    // socket.emit('message', 'Vous êtes bien connecté !');
    updateAccount().then(function (result) {
      socket.emit('init', { data: accounts })
      socket.on('action', function (data) {
        var id = data.my
        ios.emit('disable', { id: id })
        console.log('id ' + id)
        if (accounts[id].connected) {
          accounts[id].client.end('disconnect')
          ios.emit('enable_deco', { id: id })
          accounts[id].connected = false
        } else {
          var client = mcp.createClient({
            version: false,
            host: '51.15.133.233',
            port: 25565,
            username: accounts[id].email,
            password: crypt.decrypt(accounts[id].mdp)
          })
          client.id = id
          client.username = accounts[id].nom
          accounts[id].client = client
          client.on('disconnect', function (packet) {
            console.log('disconnected: ' + ' ' + this.id + ' ' + packet.reason)
          })
          client.on('error', function (err) {
            console.log('err' + err.toString())
            console.log('err ' + err)
            if (err.toString().includes('credentials')) {
              ios.emit('error', { id: this.id, username: this.username, message: 'Identifiants non valide' })
            }
            if (err.toString().includes('whitelist')) {
              ios.emit('error', { id: this.id, username: this.username, message: 'Le pseudo ' + this.username + " n'est pas whitelist" })
            }
            ios.emit('enable_deco', { id: this.id })
          })

          client.on('login', function (client) {
            console.log('Login : ' + this.username)
            console.log('uuid :' + this.uuid)

            socket.emit('logged', { id: this.id, username: this.username })
            socket.broadcast.emit('enable_co', { id: this.id })
            accounts[this.id].connected = true
          })
        }
      })
      socket.on('delAcc', function (data) {
        var id = data.my
        if (accounts.connected === true) {
          accounts.client.end('disconnect')
        }
        delete accounts[id]
        ios.emit('update', { data: accounts })
      })
    }).catch(function (error) {
      console.log(error)
    })
  })
}
