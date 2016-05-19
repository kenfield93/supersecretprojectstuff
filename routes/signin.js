/**
 * Created by kyle on 4/15/16.
 */

//TODO need to deal with issue for each route if session exists or not. How are we saving info if session is deleted
// maybe just make session never end since we don't care about server space
exports.post = function(req, res, next) {
    var userModel = require("../models/users.js");
    var userName = req.body.userName;


    //should return promise w/ false if userName doesn't exist and [primary key id, isOwner] if user exists
    var status = userModel.getSigninInfo(userName);

    status.then(function (value) {
        if (value == false) {
            res.render('error');
        }
        else {
            //note session.id is usued internally to identify sessions
            req.session.userId = value["id"];
            req.session.isOwner = value["isOwner"];
            req.session.loggedIn = true;
            req.session.name = userName;
            if( value["isOwner"] )
                res.render('Owner/home', {userName: userName});
            else
                res.render('Customer/home', {userName: userName});

        }
    }, function(error){
        res.render('wrongPermission.hjs');
    });



}