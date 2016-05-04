/**
 * Created by kyle on 5/3/16.
 */

var general = require("../models/general");

exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    general.clearProductPageSession(req.session);

    var userName = req.session.name;

    if( req.session.isOwner)
        res.render('Owner/home', {userName: userName});
    else
        res.render('Customer/home', {userName: userName});
}