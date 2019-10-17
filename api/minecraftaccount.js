var fs = require('fs')
var request = require('request')
var mcp = require('minecraft-protocol')
var crypt = require('./crypt.js')
var socket = require('socket.io')
var contaccount = require('./controller/account.js')
const accounts = {}
var ios = null

<<<<<<< HEAD
contaccount.getAccounts().then(function(result) {
	console.log("result : " + result);
	result.forEach(function(element, index) {
		element.connected = false
		element.load = false
		accounts[element.id] = element
	});
	init();
}).catch(function(err) {
	console.log("Error promise getAccount : " + err);
})

function updateAccount(){
	return new Promise((resolve, reject) => {
		contaccount.getAccounts().then(function(result) {
			result.forEach(function(element, index) {
				if(typeof accounts[element.id]==="undefined") {
					console.log("ok");
					element.connected = false;
					element.load = false
					accounts[element.id] = element;
				} else {
					var tmp = accounts[element.id];
					element.connected = tmp.connected
					element.load = tmp.load
					if(typeof tmp.client !== "undefined") {
						element.client = tmp.client
					}
					accounts[element.id] = element
				}
				resolve(accounts);
			});
		}).catch(function(err) {
			console.log("Error promise update account : " + err);
		});
	}).catch(function(error) {
		console.log('error')
	})
=======
function updateAccount () {
  return new Promise((resolve, reject) => {
    contaccount.getAccounts().then(function (result) {
      result.forEach(function (element, index) {
        if (typeof accounts[element.id] === 'undefined') {
          console.log('ok')
          element.connected = false
          accounts[element.id] = element
        } else {
          var tmp = accounts[element.id]
          element.connected = tmp.connected
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
  })
>>>>>>> 1f3ecea776fdb3aaa77d7b830bd515642ad3b8f2
}

module.exports = {
  start: function (io) {
    ios = io
    contaccount.getAccounts().then(function (result) {
      console.log('result : ' + result)
      result.forEach(function (element, index) {
        element.connected = false
        accounts[element.id] = element
      })
      init()
    }).catch(function (err) {
      console.log('Error promise getAccount : ' + err)
    })
  }
}
<<<<<<< HEAD
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  //ios.emit("error", err);
});
function init(){
=======
>>>>>>> 1f3ecea776fdb3aaa77d7b830bd515642ad3b8f2

/* module.exports = function (io) {
  ios = io
  // init();
} */

function init () {
  // console.log(accounts);
  ios.sockets.on('connection', function (socket) {
    // socket.emit('message', 'Vous êtes bien connecté !');
    updateAccount().then(function (result) {
      socket.emit('init', { data: accounts })
      socket.on('action', function (data) {
        var id = data.my
        socket.broadcast.emit('disable', { id: id })
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

<<<<<<< HEAD
		 				socket.emit("logged", {id:this.id, username:this.username});
		 				ios.emit('enable_co', {id:this.id});
		 				accounts[this.id].connected = true;
		 			});
		 			client.on("connect", function(client) {
		 				//console.log("client " + client.id)
		 			});
=======
          client.on('login', function (client) {
            console.log('Login : ' + this.username)
            console.log('uuid :' + this.uuid)
>>>>>>> 1f3ecea776fdb3aaa77d7b830bd515642ad3b8f2

            socket.emit('logged', { id: this.id, username: this.username })
            socket.broadcast.emit('enable_co', { id: this.id })
            accounts[this.id].connected = true
          })
          client.on('connect', function (client) {
            // console.log("client " + client.id)
          })
        }
      })
    })
  })
}
