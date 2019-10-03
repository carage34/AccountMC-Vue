var crypt = require("../crypt.js");
var session = require("express-session");
const bcrypt = require('bcrypt');
var server = require("../server.js")
var db = require('../db.js');
const rp = require('request-promise');
const request = require("request");
const ejsLint = require('ejs-lint');

 /*exports.list = function(req, res, next) {
 	if(!(req.session.membre)) {
 		res.render("account/fdp.ejs")
 	}
 	req.getConnection(function(err, connection) {
 		var query = connection.query("SELECT * FROM account", function(err, rows) {
 			if(err) console.log("Error Seleting list : " + err);
 			var obj = {pseudo : req.session.pseudo}
 			if(req.session.pseudo) {
 				res.render("account/index.ejs",{data: rows, locals: {session : req.session}});
 			} else {
 				res.render("account/index.ejs", {data: rows});
 			}
 			
 		})
 	})
 }*/

exports.save = function(req, res, next) {
  if((req.session.admin!=1)&&(req.session.superadmin!=1)) {
   res.redirect("/");
 }
 var input = JSON.parse(JSON.stringify(req.body));
 let request_body = {
  "agent": {
    "name": "Minecraft",
    "version": 1
  },
  "username" : input.email,
  "password" : input.mdp
}

request({
  "uri": "https://authserver.mojang.com/authenticate","method": "POST",
  "json": request_body
}, (err, ress, body) => {
  if (!err) {
    if(body.hasOwnProperty("error")) {
      res.render("account/add.ejs", {locals: {error: "Identifiants invalide", session : req.session}});
      return;
    }
    req.getConnection(function(err,connection) {
      var data = {
        email: input.email,
        nom: input.nom,
        mdp: crypt.encrypt(input.mdp),
        position: input.position,
        url: "https://crafatar.com/avatars/"+body.selectedProfile.id
      };
      var query = connection.query("INSERT INTO account set ?", data, function(err, rows, fields) {
        if(err)
          console.log("Error in Inserting Data : " + err);
        else {
          console.log("ins : " + rows.insertId);
          data.id = rows.insertId;
          res.redirect("/");
        }
      })
    });
  } else {
    console.error("Authenticate failed : " + err);
  }
});
}

exports.save_edit = function(req, res, next) {
  if((req.session.admin!=1)&&(req.session.superadmin!=1)) {
   res.redirect("/");
 }
 var input = JSON.parse(JSON.stringify(req.body));
 var id = req.params.id;
 req.getConnection(function(err,connection) {
  var data = {
    email: input.email,
    nom: input.nom,
    mdp: crypt.encrypt(input.mdp),
    position: input.position
  };
  connection.query("UPDATE account set ? WHERE id = ?", [data, id], function(err, rows) {
    if(err)
     console.log("Error in Updating : " + err);
   else {
     res.redirect("/");
   }
 })
})
}

exports.delete = function(req, res, next) {

  var id = req.params.id;
  req.getConnection(function(err,connection) {
   if((req.session.admin==1)||(req.session.superadmin==1)) {
    connection.query("DELETE FROM account where id = ?", [id], function(err, rows) {
     if(err) {
      console.log("Error in Updating : " + err);
    }
    else {
 		 			//res.redirect("/");
 		 		}
 		 	})
  }
  res.redirect("/");
})
}

exports.register = function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err,connection) {
   var data = {
    pseudo: input.pseudo,
    mdp: bcrypt.hashSync(input.pass, 10),
  };
  var query = connection.query("INSERT INTO users set ?", data, function(err, rows, fields) {
    if(err)
     console.log("Error in Inserting Data : " + err);
   else {
     req.session.pseudo = input.pseudo;
     res.redirect("/");
   }
 })
})
}

exports.login = function(req, res, next) {
  var input  = JSON.parse(JSON.stringify(req.body));
  var pseudo = input.pseudo;
  var password = input.password;

  if(pseudo && password) {
   req.getConnection(function(err,connection) {
    connection.query("SELECT * FROM users WHERE pseudo = ?", [pseudo], function(error, results, fields) {
     if(error) throw error;
 				//console.log(error);
 				if(results.length > 0) {
 					server.addUser(results[0].id, req.session.id);
 					req.session.key = results[0].id;
 					if(bcrypt.compareSync(password, results[0].mdp)) {
 						req.session.pseudo = results[0].pseudo;
 						req.session.superadmin = results[0].superadmin;
 						req.session.admin = results[0].admin;
 						req.session.membre = results[0].membre;
 						req.session.ajouter = results[0].ajouter;
 						req.session.ids = results[0].id;
 						res.redirect("/");
 					} else {
 						res.render("account/login.ejs", {locals: {err: "Mot de passe incorrect"}});
 					}
 					
 				} else {
 					req.flash("success", "<div class='alert alert-danger' role='alert'>Pseudo ou mot de passe incorrect</div>");
 					res.render("account/login.ejs", {locals: {err: "Pseudo incorrect"}});
 				}
 			})
  })
 } else {
   res.render("account/login.ejs", {locals: {err: "Entrez un pseudo et un mot de passe"}});
 }

exports.group_save = function(req, res, next) {
  /*if((req.session.admin!=1)&&(req.session.superadmin!=1)) {
    res.redirect("/");
  }*/
  var input = JSON.parse(JSON.stringify(req.body));
  var arrId = input.arrId
  var groupName = input.groupName;
  console.log("tab " + arrId);
  console.log("groupName " + groupName);
  exports.insertGroup(groupName).then(function(result) {
    console.log("group id " + result);
    
    req.getConnection(function(err,connection) {
      for(var i=0;i<arrId.length;i++) {
        var data = {
          idAccount: arrId[i],
          idGroup: result
        };
        console.log(data);
        connection.query("INSERT INTO accountGroup set ?", [data], function(err, rows) {
          if(err)
            console.log("Error in inserting acountGroup : " + err);
          else {
            
          }
        });
      }
    });
    
    res.redirect("/");
  });
}



exports.logout = function(req, res, next) {
 if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
}

exports.insertGroup = function(groupName) {
  return new Promise((resolve, reject) => {
    var data = {
      nom : groupName
    };
    db.pool.getConnection(function(err, connection) {
     if (err) throw err;
     connection.query("INSERT INTO groups set ?", data,  function(err, results, fields) {
      connection.release();
      if(err) console.log("Error Inserting group : " + err);
      resolve(results.insertId);
    })
   })
  })
}

exports.getGroups = function(req, req, next) {
  return new Promise((resolve, reject) => {
    db.pool.getConnection(function(err, connection) {
     if (err) throw err;
     connection.query("SELECT groups.id idGroup, account.id, account.nom accountName, account.url, groups.nom groupName FROM accountGroup, account, groups WHERE account.id = accountGroup.idAccount AND accountGroup.idGroup = groups.id", function(err, results, fields) {
      connection.release();
      if(err) console.log("Error Seleting list : " + err);
      console.log("groups");
      console.log(results);
      resolve(results);
    });
   });
  });
}

exports.getAccounts = function(req, res, next) {
  return new Promise((resolve, reject) => {
    db.pool.getConnection(function(err, connection) {
     if (err) throw err;
     connection.query("SELECT * FROM account", function(err, results, fields) {
      connection.release();
      if(err) console.log("Error Seleting list : " + err);
      resolve(results);
    })
   })
  })
}

exports.setAvatar = function(id, filename) {
  console.log("start insert")
  console.log("id : " + id);
  console.log("id : " + filename);
  db.query("UPDATE account SET avatar = ? WHERE id = ?", [filename, id], function(err, rows) {
    if(err) {
      console.log("Error in Updating data" + err);
    }
  })
  console.log("end insert")
}

exports.getPseudo = function(req, res, next) {
  var pseudo = req.params.pseudoo;
  request('https://api.mojang.com/users/profiles/minecraft/'+pseudo, { json: true }, (err, ress, body) => {
    if (err) { return console.log(err); }
    if(typeof body=="undefined") {
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
}

exports.deleteGroup = function(req, res, next) {
  var id = req.params.id;
  req.getConnection(function(err,connection) {
    if((req.session.admin==1)||(req.session.superadmin==1)) {
      connection.query("DELETE FROM groups where id = ?", [id], function(err, rows) {
        if(err) {
          console.log("Error in Updating : " + err);
        }
        else {
          //res.redirect("/");
        }
      })
    }
  })
}