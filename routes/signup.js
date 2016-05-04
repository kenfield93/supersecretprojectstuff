/**
 * Created by kyle on 4/10/16.
 */
var userModel = require("../models/users.js");

exports.post = function(req, res, next){

      var name = req.body.userName;
     // name = name.trim().toLowerCase();
      var age = req.body.age;
      var state = req.body.state;
      var isOwner =  req.body.role == "owner";

      req.session.name = name;
      var status = userModel.createUser(name, age, isOwner, state);
      status.then( function(outcome){ if( outcome === true) res.render('index', {userName : name}); else res.render('accountError', {userName : name});} );

}