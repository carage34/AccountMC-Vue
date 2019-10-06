var fs = require('fs'),
request = require('request');
var mcp = require('minecraft-protocol');
var crypt = require("./crypt.js");
var socket = require('socket.io');
var contaccount = require('./controller/account.js');
const accounts = {};
var res = [];

/*process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});*/

contaccount.getAccounts().then(function(result) {
	result.forEach(function(element, index) {
		element.connected = false;
		accounts[element.id] = element;
	});
	init();
}).catch(function(err) {
	console.log("Error promise getAccount : " + err);
}).then(function() {

})

function updateAccount(){
	return new Promise((resolve, reject) => {
		contaccount.getAccounts().then(function(result) {
			result.forEach(function(element, index) {
				if(typeof accounts[element.id]==="undefined") {
					console.log("ok");
					element.connected = false;
					accounts[element.id] = element;
				} else {
					var tmp = accounts[element.id];
					var newEl = element;
					newEl.connected = tmp.connected;
					if(typeof accounts[element.id].client != "undefined") {						
						accounts[element.id].client = tmp.client;
					}
					accounts[element.id] = newEl;

				}
				resolve(accounts);
			});
		}).catch(function(err) {
			console.log("Error promise update account : " + err);
		})
	})
}

function updateGroup() {
	return new Promise((resolve, reject) => {
		contaccount.getGroups().then(function(resultt){
			var obj = {};
			resultt.forEach(function(element, index) {
				if(typeof obj[element.groupName] ==="undefined") {
					obj[element.groupName] = {};
					obj[element.groupName][element.id] = element; 
				} else {
					obj[element.groupName][element.id] = element;
				}
			});
			res= [];
			res.push(obj);
			resolve(res);
        /*obj.forEach(function(element, index) {
        	console.log(element);
        })*/
    }).catch(function(err) {
    	console.log(err);
    })
});
}


var ios = null;
module.exports = function(io) {
	ios = io;
	//init();
}
/*process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  ios.emit("error", err);
});*/
function init(){

	//console.log(accounts);
	ios.sockets.on('connection', function (socket) {
		 //socket.emit('message', 'Vous êtes bien connecté !');
		 updateAccount().then(function(result) {
		 	socket.emit("init", {data : accounts});
		 }).then(function() {
		 	updateGroup().then(function(resultt) {
		 		socket.emit("initGroup", {data: resultt});
		 	})
		 })
		 socket.on("action", function(data) {
		 	var id = data.my;
		 	socket.broadcast.emit('disable', {id:id});
		 	console.log("id " + id);
		 	if(accounts[id].connected) {
		 		accounts[id].client.end("disconnect");
		 		ios.emit("enable_deco", {id: id});
		 		accounts[id].connected = false;
		 	} else {
		 		var client = mcp.createClient({
		 			version: false,
		 			host: "51.15.133.233",
		 			port: 25565,
		 			username: accounts[id].email,
		 			password: crypt.decrypt(accounts[id].mdp)
		 		});
		 		client.id = id;
		 		client.username = accounts[id].nom;
		 		accounts[id].client = client;
		 		client.on('disconnect', function (packet) {
		 			console.log('disconnected: ' + " " + this.id + " " + packet.reason);
		 		})
		 		client.on("error", function(err) {
		 			console.log("err" + err.toString());
		 			console.log("err "+err);
		 			if(err.toString().includes("credentials")) {
		 				ios.emit("error", {id:this.id, username:this.username, message: "Identifiants non valide"});
		 			} else if(err.toString().includes("whitelist")) {
		 				ios.emit("error", {id:this.id, username:this.username, message: "Le pseudo " + this.username + " n'est pas whitelist"});
		 			} else {
		 				ios.emit("error", {id:this.id, username:this.username, message: err.toString()});
		 			}
		 			ios.emit("enable_deco", {id: this.id});
		 		})

		 		client.on("login", function(client) {
		 			console.log("Login : " + this.username)
		 			console.log("uuid :" + this.uuid);

		 			socket.emit("logged", {id:this.id, username:this.username});
		 			socket.broadcast.emit('enable_co', {id:this.id});
		 			accounts[this.id].connected = true;
		 		});
		 		client.on("connect", function(client) {
		 				//console.log("client " + client.id)
		 			});

		 	}
		 });
		 
		})
}